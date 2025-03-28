import { ArrayUnique, IsArray, IsMongoId, IsNumber, IsOptional, IsString } from "class-validator"

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsString()
    role?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsNumber()
    phone?: number;

    @IsOptional()
    @IsString()
    dob?: string;

    @IsOptional()
    @IsNumber()
    fees?: number;

    @IsOptional()
    @IsMongoId()
    center?: string;

    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsMongoId({ each: true })
    schedules?: string[];
}