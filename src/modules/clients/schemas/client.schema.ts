import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
import {  Document, Types  } from 'mongoose'

@Schema({timestamps: true})
export class Client extends Document{
    
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

    @Prop({required: true, enum:['USER'], default: 'USER'})
    role: string;

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId}], ref: 'Order', default: []})
    orders: Types.ObjectId[]

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId}], ref: 'Cart'})
    carts: Types.ObjectId[];
}

export const ClientSchema = SchemaFactory.createForClass(Client);