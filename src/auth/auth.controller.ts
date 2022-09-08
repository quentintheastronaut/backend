import { AuthService } from './auth.service';
import { Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Req() req: Request) {
    console.log(req?.body);
    return this.authService.signUp();
  }

  @Post('signin')
  signIn(@Req() req: Request) {
    console.log(req?.body);
    return this.authService.login();
  }
}
