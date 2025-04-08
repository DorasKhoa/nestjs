import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Client } from './schemas/client.schema';
import mongoose, { Model } from 'mongoose';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { hashedPasswordHelper } from 'src/common/helpers/util';

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<Client>,
    private readonly cloudinaryService: CloudinaryService
  ) { }

  async findByEmail(email: string) {
    return await this.clientModel.findOne({ email }).exec();
  }

  async create(data: CreateClientDto) {
    const existingEmail = await this.clientModel.findOne({ email: data.email });
    if (existingEmail) throw new BadRequestException('Email already exist!');
    const hashedPassword = await hashedPasswordHelper(data.password);
    const newClient = new this.clientModel({
      ...data,
      password: hashedPassword,
    });
    return await newClient.save()
  }

  async findAll() {
    return await this.clientModel.find();
  }

  async findOne(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundException ('User not found!');
    const client = await this.clientModel.findById(id);
    if(!client) throw new NotFoundException('User not found!');
    return client;
  }

  async update(id: string, data: UpdateClientDto, role: string, file?: Express.Multer.File) {
    if(!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundException('User not found!');
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file, 'clients');
      data.avatar = uploadResult.secure_url; // gán url vào object update
  }
    const client = await this.clientModel.findById(id);
    if(!client) throw new NotFoundException('User not found!');
    if(role !== 'ADMIN') delete data.role
    await this.clientModel.findByIdAndUpdate(client._id, data);
    return {message: 'Updated successfully!'};
  }

  async remove(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundException('User not found!');
    const client = await this.clientModel.findByIdAndDelete(id);
    if(!client) throw new BadRequestException('User not found!'); 
    return {message: 'Deleted successfully!'};
  }
}
