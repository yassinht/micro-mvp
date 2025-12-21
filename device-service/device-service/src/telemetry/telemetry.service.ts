import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as amqp from 'amqplib';
import axios from 'axios';

@Injectable()
export class TelemetryService implements OnModuleInit {
  private readonly logger = new Logger(TelemetryService.name);
  private channel: amqp.Channel;

  constructor(
    @InjectModel('Telemetry') private readonly telemetryModel: Model<any>
  ) {}

  async onModuleInit() {
    this.logger.log('TelemetryService starting - connecting to RabbitMQ...');
    const RABBIT = process.env.RABBITMQ_URL || 'amqp://micro:micro_pass@rabbitmq:5672';
    const EXCHANGE = 'telemetry';
    try {
      const conn = await amqp.connect(RABBIT);
      this.channel = await conn.createChannel();
      await this.channel.assertExchange(EXCHANGE, 'topic', { durable: false });
      const q = await this.channel.assertQueue('', { exclusive: true });
      await this.channel.bindQueue(q.queue, EXCHANGE, '#');
      this.logger.log(`Bound temporary queue ${q.queue} to exchange ${EXCHANGE} (#)`);

      this.channel.consume(q.queue, async (msg) => {
        if (!msg) return;
        try {
          const text = msg.content.toString();
          const payload = JSON.parse(text);

          // basic validation
          if (!payload.deviceId || !payload.values) {
            this.logger.warn('Invalid telemetry payload, skipping');
            this.channel.ack(msg);
            return;
          }

          const doc = {
            deviceId: payload.deviceId,
            timestamp: payload.timestamp || new Date().toISOString(),
            location: payload.location,
            values: payload.values,
            raw: payload
          };

          await this.telemetryModel.create(doc);
          this.logger.log(`Saved telemetry for device ${payload.deviceId}`);

          // forward small event to GraphQL Gateway for subscription broadcasting
          const gw = process.env.GQL_GATEWAY_URL || 'http://gql-gateway:4000/events';
          axios.post(gw, {
            type: 'telemetry',
            data: {
              deviceId: payload.deviceId,
              timestamp: doc.timestamp,
              values: doc.values
            }
          }).catch(e => this.logger.warn('Failed to forward to gateway: ' + (e?.message || e)));

        } catch (err) {
          this.logger.error('Error processing message: ' + err.message, err.stack);
        } finally {
          this.channel.ack(msg);
        }
      });

  } catch (err) {
  this.logger.error('RabbitMQ not ready, retrying in 5s...');
  setTimeout(() => this.onModuleInit(), 5000);
}

  }

  // simple query for controller
  async getLatest(deviceId: string, limit = 50) {
    return this.telemetryModel.find({ deviceId }).sort({ timestamp: -1 }).limit(limit).lean();
  }
}
