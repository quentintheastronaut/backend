import { AuthService } from './auth.service';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() authDto: AuthDto) {
    return this.authService.signUp(authDto);
  }

  @Post('signin')
  signIn(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }
}
