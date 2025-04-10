import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from './schemas/client.schema';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';
import { Cart, CartSchema } from '../carts/schemas/cart.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Client.name, schema: ClientSchema },
    { name: Cart.name, schema: CartSchema }
  ]),
    CloudinaryModule,
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService]
})
export class ClientsModule { }
