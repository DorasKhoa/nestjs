import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";

@Schema({timestamps: true})
export class New extends Document {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    author: Types.ObjectId;

    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop({type: [String]})
    image?: string[];
}
export const NewSchema = SchemaFactory.createForClass(New);