import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CentersService } from './centers.service';
import { Roles } from 'src/decorator/customize';
import { Role } from 'src/enums/role.enum';
import { CreateCenterDto } from './dto/create-center.dto';
import { UpdateCenterDto } from './dto/update-center.dto';

@Controller('centers')
export class CentersController {
    constructor(private readonly centersService: CentersService) {}

    //========= ADMIN =========
    @Post()
    @Roles(Role.ADMIN)
    async createCenter(@Body() data: CreateCenterDto) {
        return this.centersService.createCenter(data);        
    }

    @Patch(':id')
    @Roles(Role.ADMIN)
    async updateCenter(@Param('id') id: string, @Body() data: UpdateCenterDto) {
        return this.centersService.updateCenter(id, data);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    async deleteCenter(@Param('id') id: string) {
        return this.centersService.deleteCenter(id);
    }

    @Patch(':centerId/assign/:doctorId')
    @Roles(Role.ADMIN)
    async assignDocToCenter(
        @Param('centerId') centerId: string,
        @Param('doctorId') doctorId: string
    ) {
        return this.centersService.assignDoctorToCenter(centerId, doctorId);
    }

    @Patch(':centerId/remove/:doctorId')
    @Roles(Role.ADMIN)
    async removeDocFromCenter(
        @Param('centerId') centerId: string,
        @Param('doctorId') doctorId: string,
    ) {
        return this.centersService.removeDoctorFromCenter(centerId, doctorId);
    }

    //========= ALL =========
    @Get()
    async getAllCenter() {
        return this.centersService.getAllCenter();
    }

    @Get(':id')
    async getCenterById(@Param('id') id:string) {
        return this.centersService.getCenterById(id);
    }
}
