import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePasswordHelper } from 'src/helpers/util';
import { UsersService } from 'src/modules/users/users.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if(!user) return null;
    const isValidPassword = await comparePasswordHelper(pass, user.password)
    if (!isValidPassword) return null;
    return user;
  }
  async login(user:any) {
    const payload = { sub: user._id, username: user.email, role: user.role};
    return {access_token: await this.jwtService.signAsync(payload),};
  }; 

  async register(data: CreateAuthDto) {
    return this.usersService.createUser(data);
  }
}
