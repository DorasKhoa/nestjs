import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { Roles } from 'src/common/decorator/customize';
import { Role } from 'src/common/enums/role.enum';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Controller('schedules')
export class SchedulesController {
    constructor(private readonly schedulesService: SchedulesService) {}

    //========= ADMIN =========
    @Post()
    @Roles(Role.ADMIN)
    createSchedule(@Body() data: CreateScheduleDto) {
        return this.schedulesService.createSchedule(data);
    }

    @Patch(':id')
    @Roles(Role.ADMIN)
    updateSchedule(@Param('id') id: string, @Body() data: UpdateScheduleDto) {
        return this.schedulesService.updateShedule(id, data);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    deleteSchedule(@Param('id') id: string) {
        return this.schedulesService.deleteSchedule(id);
    }

    @Patch(':scheduleId/assign/:doctorId')
    @Roles(Role.ADMIN)
    assignDocToSchedule(
        @Param('scheduleId') scheduleId: string,
        @Param('doctorId') doctorId: string,
    ) {
        return this.schedulesService.assignDocToSchedule(scheduleId, doctorId);
    }

    @Patch(':scheduleId/remove/:doctorId')
    @Roles(Role.ADMIN)
    removeDocFromSchedule(
        @Param('scheduleId') scheduleId: string,
        @Param('doctorId') doctorId: string,
    ) {
        return this.schedulesService.removeDocFromSchedule(scheduleId, doctorId);
    }

    //========= ALL =========
    @Get()
    findAllSchedule() {
        return this.schedulesService.findAllSchedule()
    }

    @Get(':id')
    findScheduleById(@Param('id') id: string) {
        return this.schedulesService.findScheduleById(id);
    }

    //viết thêm function bác sĩ chỉ coi được lịch của họ
}
