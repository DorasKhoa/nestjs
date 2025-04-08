// src/modules/auth/passport/local-client.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalClientStrategy extends PassportStrategy(Strategy, 'client-local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const client = await this.authService.unifiedLogin(email, password);
    if (!client) throw new UnauthorizedException();
    return client;
  }
}
