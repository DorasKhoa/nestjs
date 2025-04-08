import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import mongoose, { Model } from 'mongoose';
import { Schedule } from '../schedule/schemas/schedule.schema';
import { User } from '../users/schemas/user.schema';
import { Client } from '../clients/schemas/client.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Schedule.name) private scheduleModel: Model<Schedule>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Client.name) private clientModel: Model<Client>
  ) { }

  //fix lại truy vấn client (done)
  async create(scheduleId: string, clientId: string) {
    if (!mongoose.Types.ObjectId.isValid(scheduleId)) throw new NotFoundException('Schedule not found!');
    if (!mongoose.Types.ObjectId.isValid(clientId)) throw new NotFoundException('User not found!');

    const schedule = await this.scheduleModel.findById(scheduleId).populate([
      { path: 'doctor', select: 'fees' }
    ])
    if (!schedule) throw new NotFoundException('Schedule not found!');
    if (!schedule.doctor) throw new BadRequestException('No doctor in this schedule!');
    if (schedule.user) throw new BadRequestException('Schedule booked by another user!');

    const client = await this.clientModel.findById(clientId);
    if (!client) throw new NotFoundException('Client not found!');

    const newOrder = new this.orderModel({
      schedule: scheduleId,
      fees: (schedule.doctor as any).fees,
      payment: 'CASH',
      user: client._id,
      doctor: schedule.doctor._id,
      status: 'PENDING',
      date: schedule.date,
      start: schedule.start,
      end: schedule.end
    });
    await newOrder.save();

    await this.scheduleModel.findByIdAndUpdate(scheduleId, { $set: { user: client._id } });
    await this.clientModel.findByIdAndUpdate(client._id, { $push: { orders: newOrder._id } });
    await this.userModel.findByIdAndUpdate(schedule.doctor._id, { $push: { orders: newOrder._id } });
    return { message: 'Schedule book successfully!'};
  }

  async findAll() {
    const orders = await this.orderModel.find();
    if (!orders) throw new NotFoundException('Order not found!');
    return orders;
  }

  async findOne(id: string) {
    const order = await this.orderModel.findById(id)
    return order;
  }

  async findMyOrder(userId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) throw new NotFoundException('User not found!');
    const order = await this.orderModel.find({ user: userId });
    if (!order) throw new BadRequestException('Order not found!');
    return order;
  }

  //fix lại truy vấn client (done)
  async approveOrder(orderId: string, clientId: string) {
    if (!mongoose.Types.ObjectId.isValid(orderId)) throw new BadRequestException('Order not found!');
    if (!mongoose.Types.ObjectId.isValid(clientId)) throw new BadRequestException('User not found!');

    const order = await this.orderModel.findById(orderId)
    if (!order) throw new NotFoundException('Order not found!');
    if (String(order.doctor) !== String(clientId)) throw new ForbiddenException('You are not allowed to approve this order!');
    if (!order.user) throw new BadRequestException('You can approve order with no user!');
    if (order.status !== 'PENDING') throw new BadRequestException('You can only approve pending order!');

    const schedule = await this.scheduleModel.findById(order.schedule);
    if (!schedule) throw new NotFoundException('Schedule not found!');
    if (schedule.status !== 'PENDING') throw new BadRequestException('You can only aprrove pending order');
    schedule.status = 'APPROVED';
    order.status = 'APPROVED';
    order.schedule = null;
    await order.save()
    await schedule.save();

    return { message: 'Order approved successfully!' };
  }

  //fix lại truy vấn client (done)
  private async _updateCancelStatus(
    orderId: string,
    actorId: string,
    statusToSet: 'REJECTED' | 'CANCELLED',
    role: 'DOCTOR' | 'USER',
  ) {
    if (!mongoose.Types.ObjectId.isValid(orderId)) throw new NotFoundException('Order not found!');
    if (!mongoose.Types.ObjectId.isValid(actorId)) throw new NotFoundException('Order not found!');

    const order = await this.orderModel.findById(orderId);
    if (!order) throw new NotFoundException('Order not found!');
    if (order.status !== 'PENDING') throw new BadRequestException('Only pending order can be rejected!');

    if (role === 'DOCTOR' && String(order.doctor) !== String(actorId)) {
      throw new ForbiddenException('You are not allow to reject this order!');
    }

    if (role === 'USER' && String(order.user) !== String(actorId)) {
      throw new ForbiddenException('You are not allow to cancel this order!');
    }

    const scheduleId = order.schedule;
    order.schedule = null;
    order.status = statusToSet;
    await order.save()

    const schedule = await this.scheduleModel.findById(scheduleId);
    if (!schedule) throw new NotFoundException('Schedule not found!');
    if (schedule.status !== 'PENDING') throw new BadRequestException('This schedule is not in a rejectable state!');

    schedule.status = 'PENDING';
    schedule.user = null;
    await schedule.save();

    return { message: `Order ${statusToSet} successfully!` }
  }

  //fix lại truy vấn client (done)
  async rejectOrder(orderId: string, doctorId: string) {
    return this._updateCancelStatus(orderId, doctorId, 'REJECTED', 'DOCTOR');
  }

  //fix lại truy vấn client (done)
  async cancelOrder(orderId: string, clientId: string) {
    return this._updateCancelStatus(orderId, clientId, 'CANCELLED', 'USER');
  }

  async payWithCard(orderId: string, userId: string) {
    if(!mongoose.Types.ObjectId.isValid(orderId)) throw new NotFoundException('Order not found!');
    if(!mongoose.Types.ObjectId.isValid(userId)) throw new NotFoundException('User not found!');
  
    const order = await this.orderModel.findById(orderId);
    if(!order) throw new NotFoundException('Order not found!');
    
    if(String(userId) !== String(order.user)) throw new ForbiddenException('You are not allow to paid this order!');
    if(order.status !== 'PENDING') throw new BadRequestException('You can only paid pending order!');
    if(order.payment === 'PAID') throw new BadRequestException('You already paid this order!');

    const schedule = await this.scheduleModel.findById(order.schedule);
    if(!schedule) throw new NotFoundException('Schedule not found!');

    schedule.status = 'PAID';
    await schedule.save();

    order.status = 'PAID';
    order.payment = 'CARD';
    order.schedule = null;
    await order.save();

    return {message: 'Order paid successfully!'};
  }
}
