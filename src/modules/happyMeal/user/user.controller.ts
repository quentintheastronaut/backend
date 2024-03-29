import { AddAllergicDto } from './dto/request/addAllergic.dto';
import { PageDto, PageOptionsDto } from 'src/dtos';
import { User } from 'src/entities';
import { UpdateProfileDto } from './dto/request/updateProfile.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { JwtUser } from '../auth/dto/parsedToken.dto';
import { UserService } from './user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/decorators';
import { UpdateUserDto } from './dto/request/updateUser.dto';
import { AddFavoriteDto } from './dto/request/addFavorite.dto';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Patch('/profile')
  @ApiOperation({ summary: `Update user\'s profile` })
  async updateProfile(
    @Req() req: { user: JwtUser },
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const { user } = req;
    return this.userService.updateProfile(user, updateProfileDto);
  }

  @UseGuards(JwtGuard)
  @ApiOperation({ summary: `Get user\'s health overview` })
  @Get('/overview/:userId')
  async getOverviewByUser(
    @Param('userId') userId: string,
    @Query('date') date: string,
  ): Promise<PageDto<any>> {
    return this.userService.getOverviewByUser(userId, date);
  }

  @UseGuards(JwtGuard)
  @ApiOperation({ summary: `Get user\'s health overview` })
  @Get('/overview')
  async getOverview(
    @Req() req: { user: JwtUser },
    @Query('date') date: string,
  ): Promise<PageDto<any>> {
    const { user } = req;
    return this.userService.getOverview(user, date);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Update user' })
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @UseGuards(JwtGuard)
  @Get('/profile/:userId')
  @ApiOperation({ summary: "Get user's profile" })
  async getProfileByUser(@Param('userId') userId: string) {
    return this.userService.getProfileByUser(userId);
  }

  @UseGuards(JwtGuard)
  @Get('/profile')
  @ApiOperation({ summary: "Get user's profile" })
  async getProfile(@Req() req: { user: JwtUser }) {
    const { user } = req;
    return this.userService.getProfile(user);
  }

  @UseGuards(JwtGuard)
  @Get('/bmi/:userId')
  @ApiOperation({ summary: "Get user's Body Mass Index" })
  async getDailyCaloriesByUser(@Param('userId') userId: string) {
    return this.userService.getBodyMassIndexByUser(userId);
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

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  async createUser(
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<PageDto<User>> {
    return this.userService.createUser(updateUserDto);
  }

  @Get()
  @ApiPaginatedResponse(User)
  @ApiOperation({ summary: 'Get all of users' })
  async getAllUsers(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<User[]>> {
    return this.userService.getAllUser(pageOptionsDto);
  }

  @Patch('/activate/:id')
  @ApiPaginatedResponse(User)
  @ApiOperation({ summary: 'Activate user' })
  async activateUser(@Param('id') id: number): Promise<PageDto<User>> {
    return this.userService.activateUser(id);
  }

  @Patch('/deactivate/:id')
  @ApiPaginatedResponse(User)
  @ApiOperation({ summary: 'Deactivate user' })
  async deactivateUser(@Param('id') id: number): Promise<PageDto<User>> {
    return this.userService.deactivateUser(id);
  }

  @Post('/allergic')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Add allergic food' })
  async addAllergic(
    @Req() req: { user: JwtUser },
    @Body() addAllergicDto: AddAllergicDto,
  ): Promise<any> {
    const { user } = req;
    return this.userService.addAllergic(user, addAllergicDto);
  }

  @Get('/allergic')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get allergic food' })
  async getAllergicByUser(@Req() req: { user: JwtUser }): Promise<any> {
    const { user } = req;
    return this.userService.getAllergicByUser(user);
  }

  @UseGuards(JwtGuard)
  @Delete('/allergic/:allergicId')
  @ApiOperation({ summary: 'Get allergic food' })
  async removeAllergic(
    @Param('allergicId') id: string,
    @Req() req: { user: JwtUser },
  ): Promise<any> {
    const { user } = req;
    return this.userService.removeAllergic(id, user);
  }

  @Post('/favorite')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Add favorite food' })
  async addFavorite(
    @Req() req: { user: JwtUser },
    @Body() addFavoriteDto: AddFavoriteDto,
  ): Promise<any> {
    const { user } = req;
    return this.userService.addFavorite(user, addFavoriteDto);
  }

  @Get('/favorite')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get favorite food' })
  async getFavoriteByUser(@Req() req: { user: JwtUser }): Promise<any> {
    const { user } = req;
    return this.userService.getFavoriteByUser(user);
  }

  @Delete('/favorite/:favoriteId')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get favorite food' })
  async removeFavorite(
    @Req() req: { user: JwtUser },
    @Param('favoriteId') id: string,
  ): Promise<any> {
    const { user } = req;
    return this.userService.removeFavorite(id, user);
  }

  @Post('/dislike')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Add dislike food' })
  async addDislike(
    @Req() req: { user: JwtUser },
    @Body() addFavoriteDto: AddFavoriteDto,
  ): Promise<any> {
    const { user } = req;
    return this.userService.addDislike(user, addFavoriteDto);
  }

  @Get('/dislike')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get dislike food' })
  async getDislikeByUser(@Req() req: { user: JwtUser }): Promise<any> {
    const { user } = req;
    return this.userService.getDislikeByUser(user);
  }

  @Delete('/dislike/:dishId')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get dislike food' })
  async removeDislike(
    @Req() req: { user: JwtUser },
    @Param('dishId') id: string,
  ): Promise<any> {
    const { user } = req;
    return this.userService.removeDislike(id, user);
  }
}
