import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Schedule, ScheduleSchema } from './schemas/schedule.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Schedule.name, schema: ScheduleSchema },
      {name: User.name, schema: UserSchema},
    ]),
  ],
  providers: [SchedulesService],
  controllers: [SchedulesController],
  exports: [SchedulesService]
})
export class SchedulesModule {}
