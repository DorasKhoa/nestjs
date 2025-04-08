import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Center, } from './schemas/center.schema';
import mongoose, { Model } from 'mongoose';
import { CreateCenterDto } from './dto/create-center.dto';
import { UpdateCenterDto } from './dto/update-center.dto';
import { User, } from '../users/schemas/user.schema';
import { Schedule } from '../schedule/schemas/schedule.schema';

@Injectable()
export class CentersService {
    constructor(
        @InjectModel(Center.name) private centerModel: Model<Center>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Schedule.name) private scheduleModel: Model<Schedule>, 
    ) { }

    async createCenter(data: CreateCenterDto) {
        const exsitingLocal = await this.centerModel.exists({ local: data.local });
        if (exsitingLocal) throw new BadRequestException('Local is already existed')
        const existingContact = await this.centerModel.exists({ contact: data.contact });
        if (existingContact) throw new BadRequestException('Contact is already existed')
        const newCenter = new this.centerModel(data)
        return newCenter.save()
    }

    async getAllCenter() {
        const center = await this.centerModel.find();
        if (!center) throw new NotFoundException('Center not found!')
        return center;
    }

    async getCenterById(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundException('Center not found!')
        const center = await this.centerModel.findById(id);
        if (!center) throw new NotFoundException('Center not found!')
        return center;
    }

    async updateCenter(id: string, data: UpdateCenterDto) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundException('User not found!');
        const exsitingLocal = await this.centerModel.exists({ local: data.local });
        if (exsitingLocal) throw new BadRequestException('Local is already existed')
        const existingContact = await this.centerModel.exists({ contact: data.contact });
        if (existingContact) throw new BadRequestException('Contact is already existed')
        const updateCenter = await this.centerModel.findByIdAndUpdate(id, data, { new: true });
        if (!updateCenter) throw new NotFoundException('User not found!');
        return updateCenter;
    }

    //không thể xóa center khi có 1 bác sĩ đang có lịch làm
    async deleteCenter(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundException('Center not found!');

        const center = await this.centerModel.findById(id);
        if (!center) throw new NotFoundException('Center not found!');

        await this.userModel.updateMany(
            { center: id },
            { $set: { center: null } }
        );

        await this.centerModel.findByIdAndDelete(id);
        return { message: 'Center deleted successfully!' }
    }

    //thêm đk khi bác sĩ đã có người dùng đặt lịch thì Không cho phép họ đăng kí bác sĩ đi nơi khác
    async assignDoctorToCenter(centerId: string, doctorId: string) {
        if (!mongoose.Types.ObjectId.isValid(centerId)) throw new NotFoundException('Center not found!');
        if (!mongoose.Types.ObjectId.isValid(doctorId)) throw new NotFoundException('Center not found!');

        const center = await this.centerModel.findById(centerId).populate('doctors') as Center & {
            _id: mongoose.Types.ObjectId
        };

        if (!center) throw new NotFoundException('Center not found!');

        const doctor = await this.userModel.findById(doctorId) as User & {
            _id: mongoose.Types.ObjectId,
        };

        if (!doctor) throw new NotFoundException('Doctor not found!');

        if (doctor.role !== 'DOCTOR') throw new BadRequestException(`Can't add any role beside doctor to center`);

        if (center.doctors.some(doc => doc.equals(doctor._id))) throw new BadRequestException('Doctor is already in this center');

        const hasSchedule = await this.scheduleModel.exists({doctor: doctorId})
        if (hasSchedule) throw new BadRequestException('Doctor already has schedule, cannot reassigned!');

        await this.centerModel.updateMany(
            { doctors: doctorId },
            { $pull: { doctors: doctorId } }
        );

        doctor.center = center._id;
        await doctor.save();
        center.doctors.push(doctor._id);
        await center.save();

        const updatedCenter = await this.centerModel
            .findById(center._id)
            .populate({
                path: 'doctors',
                select: 'name'
            });
        return { message: 'Doctor assign successfully', updatedCenter }
    }

    async removeDoctorFromCenter(centerId: string, doctorId: string) {
        if (!mongoose.Types.ObjectId.isValid(centerId)) throw new BadRequestException('Center not found!');
        if (!mongoose.Types.ObjectId.isValid(doctorId)) throw new BadRequestException('Doctor not found!');

        const center = await this.centerModel.findById(centerId) as Center & {
            _id: mongoose.Types.ObjectId | null,
        };
        if (!center) throw new NotFoundException('Center not found!');

        const doctor = await this.userModel.findById(doctorId) as User & {
            _id: mongoose.Types.ObjectId,
        };
        if (!doctor) throw new NotFoundException('Doctor not found!');

        if (!center.doctors.some(doc => doc.equals(doctor._id))) throw new BadRequestException('Doctor is not in this center!');

        const hasSchedule = await this.scheduleModel.exists({doctor: doctorId})
        if (hasSchedule) throw new BadRequestException('Doctor already has schedule, cannot reassigned!');

        center.doctors = center.doctors.filter(doc => !doc.equals(doctor._id));
        doctor.center = null;
        await center.save();
        await doctor.save();

        const updatedCenter = await this.centerModel
            .findById(centerId)
            .populate({
                path: 'doctors',
                select: 'name'
            })
        return { message: 'Doctor remove successfully!', updatedCenter }
    }
}
