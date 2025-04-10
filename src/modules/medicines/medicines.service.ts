import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Medicine } from './schemas/medicine.schema';
import mongoose, { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';

@Injectable()
export class MedicinesService {
    constructor(
        @InjectModel(Medicine.name) private medicineModel: Model<Medicine>,
        @InjectModel(User.name) private userModel: Model<User>,
    ) {}

    async create(creatorId: string, data: CreateMedicineDto) {
        if(!mongoose.Types.ObjectId.isValid(creatorId)) throw new NotFoundException('Creator ID is not valid');
        const creator = await this.userModel.findById(creatorId);
        if(!creator) throw new NotFoundException('Creator not found!');
        const existingMed = await this.medicineModel.findOne({name: data.name});
        if(existingMed) throw new BadRequestException('Medicine already exist!');
        const newMedicine = new this.medicineModel({
            creator: creatorId,
            ...data
        })
        await newMedicine.save()
        await this.userModel.updateOne(
            {_id: creatorId},
            {$push: {medicines: newMedicine._id}}
        );
        return {message: 'Medicine created successfully!'};
    }

    async getAll() {
        return this.medicineModel.find({})
    }

    async getById(id: string) {
        if(!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundException('Medincine not found!');
        const medicine = await this.medicineModel.findById(id);
        if(!medicine) throw new NotFoundException('Medicine not found!');
        return medicine;
    }

    async update(id: string, data: UpdateMedicineDto) {
        if(!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundException('Medicine not found!');
        const medicine = await this.medicineModel.findByIdAndUpdate(id, data);
        if(!medicine) throw new NotFoundException('Medicine not found!');
        return {message: 'Medicine updated successfully!'};
    }

    async delete(id: string) {
        if(!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundException('Medicine not found!');
        const medicine = await this.medicineModel.findById(id);
        if(!medicine) throw new NotFoundException('Medicine not found!');
        await this.userModel.updateOne(
            {_id: medicine.creator},
            {$pull: {medicines: id}}
        );
        await this.medicineModel.deleteOne({_id: id});
        return {message: 'Medicine deleted successfully!'};
    }
}
