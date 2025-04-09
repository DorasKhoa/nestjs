import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRequirementDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    instruction: string;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}