import { Body, Controller, Delete, Param, Post, Request } from '@nestjs/common';
import { CartsService } from './carts.service';
import { Roles } from 'src/common/decorator/customize';
import { Role } from 'src/common/enums/role.enum';
import { CreateCartDto } from './dto/create-cart.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  //thêm thuốc vào giỏ hàng'
  //truyền vào 3 thứ
  //medicine id + id của người dùng từ payload + số lượng từ body
  @Post(':medicineId')
  @Roles(Role.USER)
  addMedToCart(
    @Param('medicineId') medicineId: string,
    @Request() req: any,
    @Body() quantity: CreateCartDto
  ) {
    return this.cartsService.addToCart(medicineId, req.user._id, quantity.quantity)
  }

  //bỏ sản phẩm ra khoi cart của người dùng
  //truyền vào 2 tham số: cartid và id user từ payload
  @Delete(':cartId')
  @Roles(Role.USER)
  removeMedfromCart(
    @Param('cartId') cartId: string,
    @Request() req: any
  ) {
    return this.cartsService.removeFromCart(cartId, req.user._id)
  }

  //thanh toán bằng tiền mặt
  //truyền vào id của cái cart và user id từ payload
  @Post('cash/:id')
  @Roles(Role.USER)
  cash(@Param('id') id:string, @Request() req:any) {
    return this.cartsService.cash(id, req.user._id);
  }

  //thanh toán bằng thẻ
  //truyền vào id của cái cart và user id từ payload
  @Post('card/:id')
  @Roles(Role.USER)
  card(@Param('id') id:string, @Request() req:any) {
    return this.cartsService.card(id, req.user._id);
  }
}
