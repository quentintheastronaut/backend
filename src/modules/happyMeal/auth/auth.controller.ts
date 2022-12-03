import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { JwtGuard } from './guard/jwt.guard';
import { JwtUser } from './dto/parsedToken.dto';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@ApiBearerAuth()
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

  @Patch('/reest-password/:id')
  resetPassword(
    @Param('id') id: number,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    const { password } = resetPasswordDto;
    return this.authService.resetPassword(id, password);
  }

  @UseGuards(JwtGuard)
  @Patch('/change-password/')
  changePassword(
    @Req() req: { user: JwtUser },
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const { user } = req;
    return this.authService.changePassword(user, changePasswordDto);
  }
}
