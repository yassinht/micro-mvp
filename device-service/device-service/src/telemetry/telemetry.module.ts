import { Module ,Logger} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TelemetrySchema } from './teletmetry.schema';
import { TelemetryService } from './telemetry.service';
import { TelemetryController } from './telemetry.controller';
@Module({
     imports: [
    MongooseModule.forFeature([{ name: 'Telemetry', schema: TelemetrySchema }]),
  ],
  providers: [TelemetryService],
  controllers: [TelemetryController],
    exports: [TelemetryService],

})
export class TelemetryModule {}
