import { AddPlanDto } from './dto/request/addPlan.dto';
import { SetAllergicDto } from './dto/request/setAllergic.dto';
import { ApiTags } from '@nestjs/swagger';
import { DetailViewsDto } from './dto/request/detailViews.dto';
import { RecombeeService } from './recombee.service';
import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Query,
  Get,
  Delete,
} from '@nestjs/common';
import { AddTrackDto } from './dto/request/addTrack.dto';
import { AddFavoriteDto } from './dto/request/addFavorite.dto';

@ApiTags('Recombee')
@Controller('recombee')
export class RecombeeController {
  constructor(private _recombeeService: RecombeeService) {}

  @Post('/detailviews')
  async sendDetailViews(@Body() detailViewsDto: DetailViewsDto) {
    return this._recombeeService.sendViewDetail(detailViewsDto);
  }

  @Put('/users/:userId')
  async sendAddUser(@Param('userId') userId: string) {
    return this._recombeeService.sendAddUser(userId);
  }

  // Track
  @Post('/track')
  async sendAddTrack(@Body() addTrackDto: AddTrackDto) {
    return this._recombeeService.addTrack(addTrackDto);
  }

  @Delete('/track')
  async sendDeleteTrack(@Body() addTrackDto: AddTrackDto) {
    return this._recombeeService.deleteTrack(addTrackDto);
  }

  // Plan
  @Post('/plan')
  async sendAddPlanAddition(@Body() addPlanDto: AddPlanDto) {
    return this._recombeeService.addPlanAddition(addPlanDto);
  }

  @Delete('/plan')
  async sendDeletePlanAddition(@Body() addPlanDto: AddPlanDto) {
    return this._recombeeService.deletePlanAddition(addPlanDto);
  }

  // Favorite
  @Post('/favorite')
  async sendAddFavoriteAddition(@Body() addFavoriteDto: AddFavoriteDto) {
    return this._recombeeService.addFavoriteAddition(addFavoriteDto);
  }

  @Delete('/favorite')
  async sendDeleteFavoriteAddition(@Body() addFavoriteDto: AddFavoriteDto) {
    return this._recombeeService.deleteFavoriteAddition(addFavoriteDto);
  }

  @Get('/recommend')
  async recommend(
    @Query('userId') userId: string,
    @Query('count') count: number,
  ) {
    return this._recombeeService.recommend({ userId, count });
  }

  @Post('/allergic')
  async addAllergicSeries(@Body() setAllergicDto: SetAllergicDto) {
    return this._recombeeService.setUserAllergic(setAllergicDto);
  }
}
