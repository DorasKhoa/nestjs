import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";

@Schema({timestamps: true})
export class Check extends Document {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Client'})
    user: Types.ObjectId;
    
    @Prop()
    name: string;

    @Prop()
    quantity: number;

    @Prop()
    price: number;

    @Prop()
    payment: string;
}

export const CheckSchema = SchemaFactory.createForClass(Check);