import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMedicineDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
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