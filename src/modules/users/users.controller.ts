import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/common/decorator/customize';
import { Role } from 'src/common/enums/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';

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
    @UseInterceptors(FileInterceptor('avatar'))
    updateUser(
        @Param('id') id: string,
        @Body() data: UpdateUserDto,
        @UploadedFile() file?: Express.Multer.File
    ) {
        return this.usersService.updateUser(id, data, file);
    }
    
    @Delete(':id')
    @Roles(Role.ADMIN)
    deleteUser(@Param('id') id: string) {
        return this.usersService.deleteUser(id);
    }

    //========= DOCTOR + ADMIN =========
    @Patch('profile')
    @Roles(Role.DOCTOR, Role.ADMIN, Role.STAFF)
    @UseInterceptors(FileInterceptor('avatar'))
    updateProfile(
        @Body() data: UpdateUserDto,
        @Request() req: any,
        @UploadedFile() file? :Express.Multer.File,
    ) {
        return this.usersService.updateUser(req.user._id, data, file);
    }

    //========= ALL =========
    @Get('profile')
    getProfile(@Request() req: any) {
        return this.usersService.findUserById(req.user._id)
    }

    @Get('alldoc')
    getAllDoc() {
        return this.usersService.getAllDoctor()
    }

    @Get('/find/:id')
    findUserById(@Param('id') id: string) {
        return this.usersService.findUserById(id)
    }
}
