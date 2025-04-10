import {IsNumber, IsOptional, IsString } from "class-validator";

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
    @IsNumber()
    quantity?: number;

    @IsOptional()
    @IsNumber()
    price?: number;
}