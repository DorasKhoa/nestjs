import { Controller, Get, Post, Patch, Param, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Roles } from 'src/common/decorator/customize';
import { Role } from 'src/common/enums/role.enum';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  //========= ADMIN =========
  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.ordersService.findAll();
  }
  //========= ADMIN & DOCTOR =========
  @Patch('/reject/:id')
  @Roles(Role.DOCTOR, Role.ADMIN)
  rejectOrder(@Param('id') id: string, @Req() req: any) {
    return this.ordersService.rejectOrder(id, req.user._id);
  }
  
  //========= DOCTOR =========
  @Patch('/approve/:id')
  @Roles(Role.DOCTOR)
  approveOrder(@Param('id') id: string, @Req() req: any) {
    return this.ordersService.approveOrder(id, req.user._id);
  }

  //========= USER & DOCTOR =========
  //xem order của họ
  @Get('me')
  @Roles(Role.USER, Role.DOCTOR)
  findMyOrder(@Req() req: any) {
    return this.ordersService.findMyOrder(req.user._id)
  }

  //========= USER =========
  //client book 1 lịch hẹn thông qua schedule
  //truyền vào schedule id và id từ payload đăng nhập của client
  @Post(':id')
  @Roles(Role.USER)
  create(@Param('id') id: string, @Req() req:any) {
    return this.ordersService.create(id, req.user._id);
  }
  
  //client hủy cái order
  //truyền vào order id và id từ payload đăng nhập của client
  @Patch('/cancel/:id')
  @Roles(Role.USER)
  cancelOrder(@Param('id') id: string, @Req() req:any) {
    return this.ordersService.cancelOrder(id, req.user._id);
    // return console.log(id);
  } 

  @Patch('/paid/:id')
  @Roles(Role.USER)
  payWithCard(@Param('id') id:string, @Req() req:any) {
    return this.ordersService.payWithCard(id, req.user._id);
  }

  //========= ALL =========
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }
}
