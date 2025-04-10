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
    @IsNumber()
    quantity?: number;
}