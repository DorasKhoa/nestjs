import { IsMongoId, IsNotEmpty } from "class-validator";

export class CreateOrderDto {
    @IsNotEmpty()
    @IsMongoId()
    schedule: string;
}
