import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";

@Schema({timestamps:true})
export class Department extends Document {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Center'})
    center: Types.ObjectId;

    @Prop()
    name:string;

    @Prop({type:mongoose.Schema.Types.ObjectId, ref: 'User', default: null})
    doctor: Types.ObjectId | null;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);