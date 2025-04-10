import { Body, Controller, Delete, Param, Post, Request } from '@nestjs/common';
import { CartsService } from './carts.service';
import { Roles } from 'src/common/decorator/customize';
import { Role } from 'src/common/enums/role.enum';
import { CreateCartDto } from './dto/create-cart.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post(':medicineId')
  @Roles(Role.USER)
  addMedToCart(
    @Param('medicineId') medicineId: string,
    @Request() req: any,
    @Body() quantity: CreateCartDto
  ) {
    return this.cartsService.addToCart(medicineId, req.user._id, quantity.quantity)
  }

  @Delete(':cartId')
  @Roles(Role.USER)
  removeMedfromCart(
    @Param('cartId') cartId: string,
    @Request() req: any
  ) {
    return this.cartsService.removeFromCart(cartId, req.user._id)
  }
}
