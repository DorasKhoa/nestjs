import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Roles } from 'src/common/decorator/customize';
import { Role } from 'src/common/enums/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  //========= ADMIN ========= 
  //tạo tài khoản client
  //truyền vào body createClientDto
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  //xem tất cả người dùng
  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.clientsService.findAll();
  }

  //xem profile của 1 client theo id
  //truyền id của client vào params
  @Get('/find/:id')
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  //admin chỉnh sửa profile của client
  //truyền vào id client vào param
  @Patch('/update/:id')
  @Roles(Role.ADMIN)
  updateClient(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
    @Request() req: any
  ) {
    return this.clientsService.update(id, updateClientDto, req.user.role);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }

  //========= USER =========
  //client xem profile của họ
  //truyền id của người dùng từ payload
  @Get('profile')
  @Roles(Role.USER)
  getProfile(@Request() req: any) {
    return this.clientsService.findOne(req.user._id);
  }

  //client update profile của client đó
  //truyền _id từ payload + data update
  @Patch('profile')
  @Roles(Role.USER)
  @UseInterceptors(FileInterceptor('avatar'))
  update(
    @Request() req: any,
    @Body() updateClientDto: UpdateClientDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.clientsService.update(req.user._id, updateClientDto, req.user.role, file);
  } 
}
