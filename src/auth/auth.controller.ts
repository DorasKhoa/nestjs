import { Controller, Body, Post, Request, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public } from 'src/common/decorator/customize';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LocalClientAuthGuard } from './passport/local-client-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  handleLogin(@Body() body: { email: string; password: string }) {
    return this.authService.unifiedLogin(body.email, body.password);
  }

  @Post('register')
  @Public()
  registerClient(@Body() registerDto: CreateAuthDto) {
    return this.authService.register(registerDto);
  }
}
