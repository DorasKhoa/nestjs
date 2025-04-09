import { Module } from '@nestjs/common';
import { CentersController } from './centers.controller';
import { CentersService } from './centers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Center, CenterSchema } from './schemas/center.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Schedule, ScheduleSchema } from '../schedule/schemas/schedule.schema';
import { Department, DepartmentSchema } from '../departments/schemas/department.schema';

@Module({
    imports: [MongooseModule.forFeature([
      {name: Center.name, schema: CenterSchema},
      {name: User.name, schema: UserSchema},
      {name: Schedule.name, schema: ScheduleSchema},
      {name: Department.name, schema: DepartmentSchema}
    ])
  ],
  controllers: [CentersController],
  providers: [CentersService],
  exports: [CentersService]
})
export class CentersModule { }
