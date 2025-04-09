import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Department } from './schemas/department.schema';
import mongoose, { Model } from 'mongoose';
import { Center } from '../centers/schemas/center.schema';
import { User } from '../users/schemas/user.schema';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
    constructor(
        @InjectModel(Department.name) private deparmentModel: Model<Department>,
        @InjectModel(Center.name) private centerModel: Model<Center>,
        @InjectModel(User.name) private userModel: Model<User>,
    ) {}

    async create(centerId: string, data: CreateDepartmentDto) {
        if(!mongoose.Types.ObjectId.isValid(centerId)) throw new NotFoundException('Center not found!');
        const center = await this.centerModel.findById(centerId)
        .populate({
            path: 'departments',
            select: 'name'
        });
        if(!center) throw new NotFoundException('Center not found!');
        const isDuplicate = center.departments.some((r:any) => r.name === data.name)
        if(isDuplicate) throw new BadRequestException('Department already exist!');
        const newDeparment = new this.deparmentModel({
            center: center._id,
            ...data
        });
        await newDeparment.save();
        await this.centerModel.updateOne(
            {_id: centerId},
            {$push: {departments: newDeparment._id}}
        );
        return {message: 'Deparment created successfully!'};
    }

    async getAll() {
        return await this.deparmentModel.find();
    }

    async getById(id: string) {
        if(!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundException('Department not found!');
        const department = await this.deparmentModel.findById(id);
        if(!department) throw new NotFoundException('Department not found!');
        return department;
    }

    async update(id: string, data: UpdateDepartmentDto) {
        if(!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundException('Department not found!');
        const department = await this.deparmentModel.findByIdAndUpdate(id, data);
        if(!department) throw new NotFoundException('Department not found!');
        return {message: 'Department updated successfully!'};
    }

    async delete(id: string) {
        if(!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundException('Department not found!');
        const department = await this.deparmentModel.findById(id)
        .populate('center')
        if(!department) throw new NotFoundException('Department not found!');
        await this.centerModel.updateOne(
            {_id: department.center},
            {$pull: {departments: id}}
        )
        await this.deparmentModel.deleteOne({_id: department._id});
        return {message: 'Department deleted successfully!'};
    }

    async assignDoc(departmentId: string, doctorId: string) {
        if(!mongoose.Types.ObjectId.isValid(departmentId)) throw new NotFoundException('Department not found!');
        if(!mongoose.Types.ObjectId.isValid(doctorId)) throw new NotFoundException('Doctor not found!');
        const department = await this.deparmentModel.findById(departmentId)
        if(!department) throw new NotFoundException('Department not found!');
        if(department.doctor) throw new BadRequestException('Department already have a doctor!')
        const center = await this.centerModel.findById(department.center);
        if(!center) throw new NotFoundException('Center not found!');
        const existDoc = center.doctors.some((r:any) => r.toString() === doctorId)
        if(!existDoc) throw new NotFoundException('Doctor is not in this center!');
        await this.deparmentModel.updateOne(
            {_id: department._id},
            {$set: {doctor: doctorId}}
        );
        return {message: 'Doctor assigned to department successfully!'};
    }

    async removeDoc(departmentId: string){
        if(!mongoose.Types.ObjectId.isValid(departmentId)) throw new NotFoundException('Department not found!')
        const department = await this.deparmentModel.findById(departmentId);
        if(!department) throw new NotFoundException('Department not found');
        if(!department.doctor) throw new BadRequestException('No Doctor to remove from department!')
        await this.deparmentModel.updateOne(
            {_id: department._id},
            {$set: {doctor: null}}
        )
        return {message: 'Doctor removed from department successfully!'}      
    }
}
