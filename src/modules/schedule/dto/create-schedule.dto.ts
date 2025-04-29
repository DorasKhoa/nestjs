import { IsMongoId, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class CreateScheduleDto {
    @IsNotEmpty()
    @IsString()
    start: string;

    @IsNotEmpty()
    @IsString()
    end: string;

    @IsNotEmpty()
    @IsString()
    date: string;

    @IsOptional()
    @IsString()
    status: string = 'UNASSIGNED';

    @IsOptional()
    @IsMongoId()
    user?: string;

    @IsOptional()
    @IsMongoId()
    doctor?: string;
}