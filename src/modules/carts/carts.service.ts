import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './schemas/cart.schema';
import mongoose, { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { Client } from '../clients/schemas/client.schema';
import { Medicine } from '../medicines/schemas/medicine.schema';

@Injectable()
export class CartsService {
    constructor(
        @InjectModel(Cart.name) private cartModel: Model<Cart>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Client.name) private clientModel: Model<Client>,
        @InjectModel(Medicine.name) private medicineModel: Model<Medicine>
    ){}

    async addToCart(medicineId: string, clientId: string, amount: number) {
        if(!mongoose.Types.ObjectId.isValid(medicineId)) throw new NotFoundException('Medicine not found!');
        if(!mongoose.Types.ObjectId.isValid(clientId)) throw new NotFoundException('Client not found!');
        const medicine = await this.medicineModel.findById(medicineId);
        if(!medicine) throw new NotFoundException('Medicine not found!');
        const client = await this.clientModel.findById(clientId)
        .populate({
            path: 'carts',
            select: 'medicine'
        });
        if(!client) throw new NotFoundException('Client not found!');
        const isDuplicate = client.carts.some((r:any) => r.medicine.toString() === medicineId);
        if(isDuplicate) throw new BadRequestException('You already add this medicine to cart!')
        const medQuantity = medicine.quantity ?? 0;
        if(amount > medQuantity) throw new BadRequestException('Medicine not enough!')
        const newCart = new this.cartModel({
            medicine: medicine._id,
            user: client._id,
            name: medicine.name,
            quantity: amount,
            price: medicine.price * amount,  
        });
        await newCart.save()
        await this.medicineModel.updateOne(
            {_id: medicine._id},
            {$set: {quantity: medQuantity - amount}}
        ) 
        await this.clientModel.updateOne(
            {_id: client._id},
            {$push: {carts: newCart._id}}
        );
        return {message: 'Medicine added to cart successfully'};
    }

    async removeFromCart(cartId: string, clientId: string) {
        if(!mongoose.Types.ObjectId.isValid(cartId)) throw new NotFoundException('Cart not found!');
        if(!mongoose.Types.ObjectId.isValid(clientId)) throw new NotFoundException('Client not found!');
        const cart = await this.cartModel.findById(cartId);
        if(!cart) throw new NotFoundException('Cart not found!');
        if(cart.user.toString() !== clientId) throw new ForbiddenException('You are not allow to remove item from cart!');
        const medicine = await this.medicineModel.findById(cart.medicine);
        if(!medicine) throw new NotFoundException('Medicine not found!');
        
        const x = medicine.quantity ?? 0;
        await this.medicineModel.updateOne(
            {_id: medicine._id},
            {$set: {quantity: x + cart.quantity}}
        )
        await this.clientModel.updateOne(
            {_id: clientId},
            {$pull: {carts: cart._id}}
        );
        await this.cartModel.deleteOne({_id: cart._id});
        return {message: 'Medicine removed from cart successfully!'};
    }
}
