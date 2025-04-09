import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Requirement } from './schemas/requirement.schema';
import mongoose, { Model } from 'mongoose';
import { CreateRequirementDto } from './dto/create-requirement.dto';
import { Center } from '../centers/schemas/center.schema';
import { UpdateRequirementDto } from './dto/update-requirement.dto';

@Injectable()
export class RequirementsService {
    constructor(
        @InjectModel(Requirement.name) private requirementModel: Model<Requirement>,
        @InjectModel(Center.name) private centerModel: Model<Center>
    ) {}

    async createRequirement(centerId: string, data: CreateRequirementDto) {
        if(!mongoose.Types.ObjectId.isValid(centerId)) throw new NotFoundException('Center not found!');
        const center = await this.centerModel.findById(centerId).populate({
            path: 'requirements',
            select: 'name'
        });
        const isDuplicate = center?.requirements.some((r:any) => r.name === data.name);
        if(isDuplicate) throw new BadRequestException('Requirement already exist');
        if(!center) throw new NotFoundException('Center not found!');
        const newRequirement = new this.requirementModel({
            center: centerId,
            ...data,
        });
        await newRequirement.save();
        await this.centerModel.updateOne(
            {_id: centerId},
            {$push: {requirements: newRequirement._id}},
        )
        return {message: 'Requirement add successfully!'};
    }

    async getAll() {
        return await this.requirementModel.find();
    }

    async getById(id: string) {
        if(!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException('Requirement not found!');
        const requirement = await this.requirementModel.findById(id);
        if(!requirement) throw new NotFoundException('Requirement not found!');
        return requirement;
    }

    async getRequirementByCenter(centerId: string) {
        if(!mongoose.Types.ObjectId.isValid(centerId)) throw new NotFoundException('Center not found!');
        const requirements = await this.requirementModel.find({center: centerId});
        if(!requirements) throw new NotFoundException('Requirement not found!');
        return requirements;
    }

    async update(id: string, data: UpdateRequirementDto) {
        if(!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundException('Requirement not found!');
        const requirement = await this.requirementModel.findByIdAndUpdate(id, data);
        if(!requirement) throw new NotFoundException('Requirement not found!');
        return {message: 'Requirement updated successfully!'}
    }

    async delete(id: string) {
        if(!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundException('Requirement not found!');
        const requirement = await this.requirementModel.findById(id);
        if(!requirement) throw new NotFoundException('Requirement not found!');
        await this.centerModel.findByIdAndUpdate(
            requirement.center,
            {$pull: {requirements: requirement._id}}
        )
        await this.requirementModel.deleteOne({_id: id})
        return {message: 'Requirement deleted successfully!'};
    }
}
