import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose'
import { Document, Types } from 'mongoose'

@Schema({ timestamps: true })
export class Schedule extends Document {

    @Prop({ required: true })
    start: string;

    @Prop({ required: true })
    end: string;

    @Prop({ required: true })
    date: string;

    @Prop({ required: true, enum: ['PENDING', 'UNASSIGNED', 'APPROVED', 'REJECTED', 'PAID'], default: 'UNASSIGNED' })
    status: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null })
    user?: Types.ObjectId | null

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null })
    doctor?: Types.ObjectId | null
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);