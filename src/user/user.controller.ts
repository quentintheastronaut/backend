import { JwtGuard } from './../auth/guard/jwt.guard';
import { JwtUser } from './../auth/dto/parsedToken.dto';
import { UserService } from './user.service';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get('/profile')
  getProfile(@Req() jwtUser: JwtUser) {
    return this.userService.getProfile(jwtUser);
  }
}
