import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class CreateAuthDto {
    @IsOptional()
    @IsString()
    name: string
    
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Matches(/^(?=.*[0-9])(?=.*[\W_])/, 
    { message: 'Password must contain at least one number and one special character' })
    password: string
}
