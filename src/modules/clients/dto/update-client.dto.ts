import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class UpdateClientDto {
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
    password?: string;

    @IsOptional()
    @IsString()
    role?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    phone?: number;

    @IsOptional()
    @IsString()
    dob?: string;
}
