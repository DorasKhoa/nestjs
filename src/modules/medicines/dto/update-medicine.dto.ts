import {IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class UpdateMedicineDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    ingredient: string;

    @IsOptional()
    @Type(()=> Number)
    @IsNumber()
    quantity?: number;

    @IsOptional()
    @Type(()=> Number)
    @IsNumber()
    price?: number;
}