import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/decorator/customize';
import { Role } from 'src/enums/role.enum';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    //========= ADMIN =========

    @Post()
    @Roles(Role.ADMIN)
    createUser(@Body() data: CreateUserDto) {
        return this.usersService.createUser(data);
    }

    @Get()
    @Roles(Role.ADMIN)
    findAllUsers() {
        return this.usersService.findAllUsers();
    }

    @Patch('/update/:id')
    @Roles(Role.ADMIN)
    updateUser(@Param('id') id: string, @Body() data: UpdateUserDto) {
        return this.usersService.updateUser(id, data);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    deleteUser(@Param('id') id: string) {
        return this.usersService.deleteUser(id);
    }

    //========= ALL =========

    @Get('profile')
    getProfile(@Request() req) {
        return this.usersService.findUserById(req.user._id)
    }

    @Patch('profile')
    updateProfile(@Request() req, data: UpdateUserDto) {
        return this.usersService.updateUser(req.user._id, data);
    }

    @Get('/find/:id')
    findUserById(@Param('id') id: string) {
        return this.usersService.findUserById(id)
    }

}
