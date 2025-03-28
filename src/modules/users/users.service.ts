import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashedPasswordHelper } from 'src/helpers/util';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async findByEmail(email: string) {
        return await this.userModel.findOne({ email }).exec();
    }

    async createUser(data: CreateUserDto) {
        const existingEmail = await this.userModel.exists({email: data.email})
        if(existingEmail) throw new BadRequestException('Email is already used!')
        const hashedPassword = await hashedPasswordHelper(data.password);
        const newUser = new this.userModel({
            ...data,
            password: hashedPassword,
        });
        return newUser.save()
    }

    async findAllUsers() {
        const users = await this.userModel.find().exec();
        if (!users) throw new NotFoundException('User not found!');
        return users;
    }

    async findUserById(id: string) {
        console.log(id);
        if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundException('User not found!')
        const user = await this.userModel.findById(id).exec();
        if (!user) throw new NotFoundException('User not found!');
        return await this.userModel.findById(id);
    }

    async updateUser(id: string, data: UpdateUserDto) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundException('User not found!')
        const updateUser = await this.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
        if (!updateUser) throw new NotFoundException('User not found!');
        return { message: 'User updated successfully', updateUser }
    }

    // logic: không thể xóa bác sĩ khi mà họ đã được gán vào lịch làm.
    async deleteUser(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundException('User not found!')
        const user = await this.userModel.findById(id).exec();
        if (!user) throw new NotFoundException('User not Found')
        return await this.userModel.findByIdAndDelete(id);
    }
}
