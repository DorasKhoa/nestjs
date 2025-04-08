import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";
import { Role } from "src/common/enums/role.enum";

export class CreateUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @Matches(/^(?=.*[0-9])(?=.*[\W_])/,
    { message: 'Password must contain at least one number and one special character' })
    password: string;

    @IsOptional()
    @IsEnum(Role, {
        message: 'Invalid role!'
    })
    role?: string
}