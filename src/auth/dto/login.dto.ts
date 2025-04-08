import { IsEmail, IsNotEmpty, IsEnum } from 'class-validator';

export enum Role {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  USER = 'USER',
}

export class LoginDto {
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    password: string;
  }
