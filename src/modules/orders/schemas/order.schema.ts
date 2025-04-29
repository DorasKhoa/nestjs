import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import { Document, Types } from "mongoose";
import * as mongoose from 'mongoose';

@Schema({timestamps: true})
export class Order extends Document {

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Schedule'})
    schedule: Types.ObjectId | null;
    
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true})
    user: Types.ObjectId
    
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true})
    doctor: Types.ObjectId

    @Prop({ required: true, enum: ['PENDING', 'UNASSIGNED', 'APPROVED', 'REJECTED', 'CANCELLED', 'PAID'], default: 'PENDING' })
    status: string;

    @Prop({required: true})
    date: string;

    @Prop({required: true})
    start: string;

    @Prop({required: true})
    end: string;

    @Prop({required: true})
    fees: number;

    @Prop({required: true, enum:['CASH', 'CARD'], default: null})
    payment: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);