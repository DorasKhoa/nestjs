import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Center, CenterSchema } from '../centers/schemas/center.schema';

@Module({
    imports:[MongooseModule.forFeature([
        {name: User.name, schema: UserSchema},
        {name: Center.name, schema: CenterSchema},
    ]),
],
    controllers:[UsersController],
    providers:[UsersService],
    exports:[UsersService]
})
export class UsersModule {}
