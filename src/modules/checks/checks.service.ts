import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Check } from './schemas/check.schema';
import mongoose, { Model } from 'mongoose';
import { Client } from '../clients/schemas/client.schema';

@Injectable()
export class ChecksService {
    constructor(
        @InjectModel(Check.name) private checkModel: Model<Check>,
        @InjectModel(Client.name) private clientModel: Model<Client>
    ) { }

    async getAllCheckByUser(clientId: string) {
        if (!mongoose.Types.ObjectId.isValid(clientId)) throw new NotFoundException('User not found!');
        const checks = await this.checkModel.find({ user: clientId });
        if (!checks) throw new NotFoundException('Check not found!');
        return checks;
    }

    async getById(checkId: string, clientId: string) {
        if (!mongoose.Types.ObjectId.isValid(checkId)) throw new NotFoundException('Cart not found!');
        const check = await this.checkModel.findById(checkId);
        if (!check) throw new NotFoundException('Check not found!')
        const client = await this.clientModel.findById(clientId) as Client &
        {_id: mongoose.Types.ObjectId};
        if (!client) throw new NotFoundException('Client not found!');
        if (!check.user.equals(client._id)) throw new ForbiddenException('You are not allow to view this');
        return check;
    }
}
