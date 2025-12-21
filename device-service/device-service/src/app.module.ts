import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelemetryModule } from './telemetry/telemetry.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
imports: [
  MongooseModule.forRoot(
    process.env.MONGO_URI || 'mongodb://mongo:27017/device',
  ),
  TelemetryModule,
],  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
