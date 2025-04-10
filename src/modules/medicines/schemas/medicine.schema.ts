import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";

@Schema({timestamps: true})
export class Medicine extends Document {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    creator: Types.ObjectId;

    @Prop()
    name: string;

    @Prop({default: null})
    description?: string;

    @Prop()
    ingredient: string;

    @Prop({default: 1})
    quantity?: number;

    @Prop({default: 0})
    price: number;
}

export const MedicineSchema = SchemaFactory.createForClass(Medicine);