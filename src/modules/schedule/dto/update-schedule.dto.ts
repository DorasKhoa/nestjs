import { IsMongoId, IsOptional, IsString, IsNotEmpty, Matches } from "class-validator";

export class UpdateScheduleDto {
    @IsNotEmpty()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Time must be in HH:mm format' })
    start?: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Time must be in HH:mm format' })
    end?: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, {
        message: 'Date must be in the format YYYY-MM-DD',
      })
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