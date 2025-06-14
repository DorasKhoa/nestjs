import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateCartDto {
    @IsNotEmpty()
    @Type(()=> Number)
    @IsNumber()
    quantity: number
}