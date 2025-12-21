import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TelemetryService } from './telemetry.service';
import { TelemetrySchema } from './telemetry.schema';
import { TelemetryController } from './telemetry.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Telemetry', schema: TelemetrySchema },
    ]),
  ],
    controllers: [TelemetryController], // ✅ ADD THIS

  providers: [TelemetryService],
})
export class TelemetryModule {}
