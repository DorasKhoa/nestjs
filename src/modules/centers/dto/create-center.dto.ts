import { Type } from "class-transformer";
import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCenterDto {
    @IsNotEmpty()
    @IsString()
    local: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(()=> Number)
    contact: number;

    @IsOptional()
    @IsArray()
    @IsMongoId({each: true})
    doctors?: string[];
}