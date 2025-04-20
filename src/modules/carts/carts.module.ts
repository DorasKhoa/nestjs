import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Client, ClientSchema } from '../clients/schemas/client.schema';
import { Medicine, MedicineSchema } from '../medicines/schemas/medicine.schema';
import { Check, CheckSchema } from '../checks/schemas/check.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Cart.name, schema: CartSchema},
      {name: User.name, schema: UserSchema},
      {name: Client.name, schema: ClientSchema},
      {name: Medicine.name, schema: MedicineSchema},
      {name: Check.name, schema: CheckSchema}
    ]),
  ],
  controllers: [CartsController],
  providers: [CartsService],
  exports: [CartsService]
})
export class CartsModule {}
