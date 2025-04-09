import {IsMongoId, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateRequirementDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    instruction?: string;

    @IsOptional()
    @IsNumber()
    quantity?: number;
}