import { IsMongoId, IsOptional, IsString, IsNotEmpty, Matches } from "class-validator";

export class UpdateScheduleDto {
    @IsNotEmpty()
    @IsString()
    start?: string;

    @IsNotEmpty()
    @IsString()
    end?: string;

    @IsNotEmpty()
    @IsString()
    date?: string;

    @IsOptional()
    @IsString()
    status?: string = 'UNASSIGNED';

    @IsOptional()
    @IsMongoId()
    user?: string;

    @IsOptional()
    @IsMongoId()
    doctor?: string;
}