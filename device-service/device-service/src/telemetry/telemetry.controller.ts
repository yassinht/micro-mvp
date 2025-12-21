import { Controller ,Get,Param,Query} from '@nestjs/common';
import { TelemetryService } from './telemetry.service';

@Controller('devices')
export class TelemetryController {

constructor(private readonly telem: TelemetryService){}

@Get(':id/telemetry')
async getTelemetry(@Param('id')id:string,@Query('limit') limit = '50'){
    const n = parseInt(limit as string,10) || 50;
    const docs = await this.telem.getLatest(id,n);
    return docs;
}
}
