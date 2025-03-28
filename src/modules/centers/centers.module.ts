import { Module } from '@nestjs/common';
import { CentersController } from './centers.controller';
import { CentersService } from './centers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Center, CenterSchema } from './schemas/center.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
    imports: [MongooseModule.forFeature([
      {name: Center.name, schema: CenterSchema},
      {name: User.name, schema: UserSchema},
    ])
  ],
  controllers: [CentersController],
  providers: [CentersService],
  exports: [CentersService]
})
export class CentersModule { }
