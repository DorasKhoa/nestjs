import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RequirementsService } from './requirements.service';
import { Roles } from 'src/common/decorator/customize';
import { Role } from 'src/common/enums/role.enum';
import { CreateRequirementDto } from './dto/create-requirement.dto';
import { UpdateRequirementDto } from './dto/update-requirement.dto';

@Controller('requirements')
export class RequirementsController {
  constructor(private readonly requirementsService: RequirementsService) {}

  //thêm 1 thiết bị vào 1 center
  //truyền vào 2 tham số dưới service:
  //center id mà mình muốn add thiết bị vào và thông tin của thiết bị
  @Post(':id')
  @Roles(Role.ADMIN)
  createRequirement(
    @Param('id') id: string,
    @Body() createRequirementDto: CreateRequirementDto,
  ) {
    return this.requirementsService.createRequirement(id, createRequirementDto);
  }

  //xem tất cả thiết bị
  @Get()
  @Roles(Role.ADMIN)
  getAllRequirement() {
    return this.requirementsService.getAll();
  }

  //xem thông tin của 1 thiết bị
  //truyền vào requirement id
  @Get(':id')
  @Roles(Role.ADMIN)
  GetRequirementById(@Param('id') id:string) {
    return this.requirementsService.getById(id);
  }

  //xem những thiết bị thuộc 1 center nào đó
  //truyền vào param id của center
  @Get('/center/:id')
  @Roles(Role.ADMIN)
  GetRequirementByCenter(@Param('id') id:string) {
    return this.requirementsService.getRequirementByCenter(id);
  }

  //chỉnh sửa requirement
  //truyền vào department id
  @Patch(':id')
  @Roles(Role.ADMIN)
  UpdateRequirement(@Param('id') id:string, @Body() data: UpdateRequirementDto) {
    return this.requirementsService.update(id, data);
  }

  //xóa requirement
  //truyền vào department id
  @Delete(':id')
  @Roles(Role.ADMIN)
  deleteRequirement(@Param('id') id:string) {
    return this.requirementsService.delete(id);
  }
}
