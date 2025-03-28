import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCenterDto {
    @IsNotEmpty()
    @IsString()
    local: string;

    @IsNotEmpty()
    @IsNumber()
    contact: number;

    @IsOptional()
    @IsArray()
    @IsMongoId({each: true})
    doctors?: string[];
}