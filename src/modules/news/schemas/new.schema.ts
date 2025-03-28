import { Prop, Schema } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({timestamps: true})
export class New extends Document {
    @Prop()
    title: string;

    @Prop()
    description?: string
}