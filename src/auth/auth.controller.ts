import { AuthService } from './auth.service';
import { Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp() {
    return this.authService.signUp();
  }

  @Post('signin')
  signIn() {
    return this.authService.login();
  }
}
