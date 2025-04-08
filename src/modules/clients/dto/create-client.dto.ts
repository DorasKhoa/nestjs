import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class CreateClientDto {
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
}
