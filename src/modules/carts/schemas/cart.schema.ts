import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";

@Schema({timestamps: true})
export class Cart extends Document {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Medicine'})
    medicine: Types.ObjectId;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    user: Types.ObjectId;

    @Prop()
    name: string;

    @Prop()
    quantity: number;

    @Prop()
    price: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);