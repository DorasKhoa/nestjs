import { Module } from '@nestjs/common';
import { RequirementsService } from './requirements.service';
import { RequirementsController } from './requirements.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Requirement, RequirementSchema } from './schemas/requirement.schema';
import { Center, CenterSchema } from '../centers/schemas/center.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Requirement.name, schema: RequirementSchema},
      {name: Center.name, schema: CenterSchema},
    ]),
  ],
  controllers: [RequirementsController],
  providers: [RequirementsService],
  exports: [RequirementsService]
})
export class RequirementsModule {}
