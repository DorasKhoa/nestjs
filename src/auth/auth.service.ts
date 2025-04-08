import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePasswordHelper } from 'src/common/helpers/util';
import { UsersService } from 'src/modules/users/users.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ClientsService } from 'src/modules/clients/clients.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private ClientsService: ClientsService,
    private jwtService: JwtService
  ) {}

  async unifiedLogin(email: string, password: string) {
    let user: any;
    let role: string = 'UNKNOWN';
  
    // Ưu tiên tìm trong User (admin/doctor)
    user = await this.usersService.findByEmail(email);
    if (user) {
      role = user.role;
    } else {
      // Nếu không thấy, thử tìm trong Client
      user = await this.ClientsService.findByEmail(email);
      if (user) {
        role = 'USER';
      }
    }
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    const isValidPassword = await comparePasswordHelper(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Wrong password');
    }
  
    const payload = {
      sub: user._id,
      username: user.email,
      role,
    };
  
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(data: CreateAuthDto) {
    return this.ClientsService.create(data);
  }
}
