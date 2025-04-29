import { ArrayUnique, IsArray, IsMongoId, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class UpdateCenterDto {
    @IsOptional()
    @IsString()
    local?: string;

    @IsOptional()
    @IsNumber()
    @Type(()=> Number)
    contact?: number;

    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsMongoId({ each: true })
    doctors?: string[];
}