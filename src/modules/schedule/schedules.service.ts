import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel, Schema } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Schedule } from './schemas/schedule.schema';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class SchedulesService {
    constructor(
        @InjectModel(Schedule.name) private scheduleModel: Model<Schedule>,
        @InjectModel(User.name) private userModel: Model<User>,
    ) { }

    async createSchedule(data: CreateScheduleDto) {
        //thêm logic tạo lịch giờ start < end
        //...
        const newSchedule = new this.scheduleModel(data)
        return await newSchedule.save();
    }

    async findAllSchedule() {
        return await this.scheduleModel.find();
    }

    async findScheduleById(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundException('Schedule not found!');
        const schedule = await this.scheduleModel.findById(id);
        if (!schedule) throw new NotFoundException('Schedule not found!');
        return schedule;
    }

    async updateShedule(id: string, data: UpdateScheduleDto) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundException('Schedule not found!');
        const updateSchedule = await this.scheduleModel.findByIdAndUpdate(id, data, { new: true });
        if (!updateSchedule) throw new NotFoundException('Schedule not found!');
        return { message: 'Schedule updated successfully!', updateSchedule };
    }

    async deleteSchedule(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundException('Schedule not found!');
        const deleteSchedule = await this.scheduleModel.findByIdAndDelete(id);
        if (!deleteSchedule) throw new NotFoundException('Schedule not found!');
        return { message: 'Schedule deleted successfully!' };
    }

    async assignDocToSchedule(scheduleId: string, doctorId: string) {
        if (!mongoose.Types.ObjectId.isValid(scheduleId)) throw new NotFoundException('Schedule not found!');
        if (!mongoose.Types.ObjectId.isValid(doctorId)) throw new NotFoundException('Doctor not found!');

        const schedule = await this.scheduleModel.findById(scheduleId);
        if (!schedule) throw new NotFoundException('Schedule not found!')

        const doctor = await this.userModel.findById(doctorId);
        if (!doctor) throw new NotFoundException('Doctor not found!');

        if (doctor.role !== 'DOCTOR') throw new BadRequestException('Only assign doctor to center');
        if (!doctor.center) throw new BadRequestException('Doctor not in any center, failed to assign!');

        if (schedule.status !== 'UNASSIGNED') throw new BadRequestException('Schedule status must be UNASSIGNED to assign doctor!');
        if (schedule.doctor) throw new BadRequestException('Schedule is already have a doctor, failed to assign!');

        const overlapping = await this.scheduleModel.findOne({
            doctor: doctorId,
            date: schedule.date,
            $or: [
                {
                    start: { $lt: schedule.end },
                    end: { $gt: schedule.start },
                },
            ],
        });
        if (overlapping) throw new BadRequestException(`Doctor already has a schedule that overlaps with this time slot.`);

        await this.scheduleModel.updateOne(
            {_id: scheduleId},
            {$set: {doctor: doctorId, status: 'PENDING'}},
        );
        await this.userModel.updateOne(
            {_id: doctorId},
            {$push: {schedules: scheduleId}},
        );
        return {message: 'Doctor assign successfully!'};
    }

    async removeDocFromSchedule(scheduleId: string, doctorId: string) {
        if(!mongoose.Types.ObjectId.isValid(scheduleId)) throw new NotFoundException('Schedule not found!');
        if(!mongoose.Types.ObjectId.isValid(doctorId)) throw new NotFoundException('Doctor not found!');
        
        const schedule = await this.scheduleModel.findById(scheduleId);
        if(!schedule) throw new NotFoundException('Schedule not found!');
        
        if(!schedule.doctor) throw new BadRequestException('Schedule have no doctor!')
        
        if(schedule.user) throw new BadRequestException('Schedule had been book by user, failed to remove doctor!');
        
        const doctor = await this.userModel.findById(doctorId);
        
        if(!doctor) throw new NotFoundException('Doctor not found!');

        await this.scheduleModel.updateOne(
            {_id: scheduleId},
            {$set: {doctor: null, status: 'UNASSIGNED'}},
        );
        await this.userModel.updateOne(
            {_id: doctorId},
            {$pull: {schedules: scheduleId}},
        );
        return {message: 'Doctor removed from schedule successfully!'};
    }
}
