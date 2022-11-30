import { UpdateProfileDto } from './dto/request/updateProfile.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { JwtUser } from '../auth/dto/parsedToken.dto';
import { UserService } from './user.service';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get('/profile')
  async getProfile(@Req() req: { user: JwtUser }) {
    const { user } = req;
    return this.userService.getProfile(user);
  }

  @UseGuards(JwtGuard)
  @Post('/profile')
  async updateProfile(
    @Req() req: { user: JwtUser },
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const { user } = req;
    return this.userService.updateProfile(user, updateProfileDto);
  }

  @UseGuards(JwtGuard)
  @Get('/bmi')
  @ApiOperation({ summary: "Get user's Body Mass Index" })
  async getDailyCalories(@Req() req: { user: JwtUser }) {
    const { user } = req;
    return this.userService.getBodyMassIndex(user);
  }

  @UseGuards(JwtGuard)
  @Get('/bmr')
  @ApiOperation({ summary: "Get user's Basal Metabolic Rate" })
  async getBasalMetabolicRate(@Req() req: { user: JwtUser }) {
    const { user } = req;
    return this.userService.getBasalMetabolicRate(user);
  }
}
