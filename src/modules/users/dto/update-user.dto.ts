import { Type } from "class-transformer";
import { ArrayUnique, IsArray, IsMongoId, IsNumber, IsOptional, IsString, Matches, MinLength } from "class-validator"

export class UpdateUserDto {

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    @MinLength(6)
    @Matches(/^(?=.*[0-9])(?=.*[\W_])/,
        { message: 'Password must contain at least one number and one special character' })
    password: string;

    @IsOptional()
    @IsString()
    role?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsNumber()
    @Type(()=> Number)
    phone?: number;

    @IsOptional()
    @IsString()
    dob?: string;

    @IsOptional()
    @IsNumber()
    @Type(()=> Number)
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