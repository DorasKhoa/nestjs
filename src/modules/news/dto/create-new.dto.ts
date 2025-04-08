import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateNewDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    image?: string;
}