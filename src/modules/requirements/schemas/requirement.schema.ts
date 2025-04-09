import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";

@Schema({timestamps: true})
export class Requirement extends Document {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Center'})
    center: Types.ObjectId;

    @Prop({required: true})
    name: string;

    @Prop({required: true})
    instruction: string;

    @Prop({default: 1})
    quantity: number;
}

export const RequirementSchema = SchemaFactory.createForClass(Requirement);