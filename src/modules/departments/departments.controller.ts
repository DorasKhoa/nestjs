import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { Roles } from 'src/common/decorator/customize';
import { Role } from 'src/common/enums/role.enum';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  //========== ADMIN ==========
  
  //tạo 1 department
  //tryền vào center id và data
  @Post(':id')
  @Roles(Role.ADMIN)
  createDepartment(
    @Param('id') id:string,
    @Body() data: CreateDepartmentDto
  ) {
    return this.departmentsService.create(id, data);
  }

  //xem tất cả department
  @Get()
  @Roles(Role.ADMIN)
  getAllDepartment() {
    return this.departmentsService.getAll()
  }

  //xem department theo id
  // truyền department id vào param
  @Get(':id')
  @Roles(Role.ADMIN)
  getDepartmentById(@Param('id') id:string) {
    return this.departmentsService.getById(id);
  } 

  //chỉnh sửa 1 phòng ban
  //truyền vào department id và data chỉnh sửa
  @Patch(':id')
  @Roles(Role.ADMIN)
  updateDepartment(
    @Param('id') id:string,
    @Body() data: UpdateDepartmentDto
  ) {
    return this.departmentsService.update(id, data);
  }

  //xóa phòng ban
  //truyền vào department id
  @Delete(':id')
  @Roles(Role.ADMIN)
  deleteRequirement(@Param('id') id:string) {
    return this.departmentsService.delete(id);
  }

  //đăng ký bác sĩ vào phòng ban
  //truyền vào 2 tham số vào param:
  //deparment id và doctor id
  @Patch(':departmentId/assign/:doctorId')
  @Roles(Role.ADMIN)
  assignDocToDepartment(
    @Param('departmentId') departmentId: string,
    @Param('doctorId') doctorId: string
  ) {
    return this.departmentsService.assignDoc(departmentId, doctorId);
  }

  //bỏ bác sĩ ra khỏi phòng ban
  //truyền vào department id
  @Patch(':id/remove')
  @Roles(Role.ADMIN)
  removeDocFromDepartment(@Param('id') id:string) {
    return this.departmentsService.removeDoc(id);
  }
}
