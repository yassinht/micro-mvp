import {Schema, Document} from 'mongoose';

export interface TelemetryDocument extends Document {

    deviceId:string;
    timestamp:string;
    values:any;
    raw?:any;
    location:any;

}

export const TelemetrySchema = new Schema<TelemetryDocument>({

    deviceId: {type : String,required:true,index:true},
    timestamp:{type:String , requierd:true},
    location:{type:String},
    values:{type:Schema.Types.Mixed},
    raw: {type: Schema.Types.Mixed},
},{timestamps:true});