import { ArrayUnique, IsArray, IsMongoId, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateCenterDto {
    @IsOptional()
    @IsString()
    local?: string;

    @IsOptional()
    @IsNumber()
    contact?: number;

    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsMongoId({ each: true })
    doctors?: string[];
}