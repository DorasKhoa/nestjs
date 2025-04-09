import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {  Document, Types  } from 'mongoose'
import * as mongoose from 'mongoose';

@Schema({timestamps: true})
export class Center extends Document {

    @Prop({required: true, unique: true})
    local: string;

    @Prop({required: true, unique: true})
    contact: number;

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}], default: []})
    doctors: Types.ObjectId[];

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId}], ref:'Requirement', default:[]})
    requirements: Types.ObjectId[];

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId}],ref: 'Department', default:[]})
    departments: Types.ObjectId[];
}

export const CenterSchema = SchemaFactory.createForClass(Center);