import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
import {  Document, Types  } from 'mongoose'

@Schema({timestamps: true})
export class User extends Document{
    
    @Prop({default: null})
    avatar: string;

    @Prop({default: null})
    name: string;

    @Prop({required: true, unique: true})
    email: string;

    @Prop({required: true})
    password: string;

    @Prop({default: null})
    address?: string;

    @Prop({default: null})
    phone?: number;

    @Prop({default: null})
    dob?: string;

    @Prop({default: 0})
    fees?: number;

    @Prop({required: true, enum:['USER', 'ADMIN', 'DOCTOR', 'STAFF'], default: 'USER'})
    role: string;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Center', default: null})
    center?: Types.ObjectId | null; 

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId}], ref: 'Schedule', default: []})
    schedules: Types.ObjectId[];

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId}], ref: 'Order', default: []})
    orders: Types.ObjectId[];

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId}], ref: 'News', default: []})
    news: Types.ObjectId[];

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId}], ref: 'Medicine', default: []})
    medicines: Types.ObjectId[];

    @Prop()
    category: string
}

export const UserSchema = SchemaFactory.createForClass(User);