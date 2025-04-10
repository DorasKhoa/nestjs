import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { Roles } from 'src/common/decorator/customize';
import { Role } from 'src/common/enums/role.enum';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';

@Controller('medicines')
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) {}

  //============== ADMIN ==============
  //tạo thuốc
  //truyền vào 2 tham số
  // id của người tạo từ payload và dữ liệu tạo
  @Post()
  @Roles(Role.ADMIN)
  createMedicine(@Request() req: any, @Body() data: CreateMedicineDto) {
    return this.medicinesService.create(req.user._id, data);
  }
  
  @Patch(':id')
  @Roles(Role.ADMIN)
  updateMedicine(
    @Param('id') id: string,
    @Body() data: UpdateMedicineDto
  ) {
    return this.medicinesService.update(id, data);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  deleteMedicine(@Param('id') id: string) {
    return this.medicinesService.delete(id);
  }
  //============== ADMIN + USER ==============
  //xem tất cả thuốc
  @Get()
  @Roles(Role.ADMIN, Role.USER)
  getAllMedicine() {
    return this.medicinesService.getAll();
  }

  //xem thông tin của 1 loại thuốc nào đó
  //truyền medicine id vào param
  @Get(':id')
  @Roles(Role.ADMIN, Role.USER)
  getMedById(@Param('id') id:string) {
    return this.medicinesService.getById(id);
  }
}
