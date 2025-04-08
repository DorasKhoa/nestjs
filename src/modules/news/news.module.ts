import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { New, NewSchema } from './schemas/new.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';

@Module({
  imports: [MongooseModule.forFeature([
    {name: New.name, schema: NewSchema},
    {name: User.name, schema: UserSchema}
  ]),
  CloudinaryModule
  ],
  controllers: [NewsController],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsModule { }
