import { SetAllergicDto } from './dto/request/setAllergic.dto';
import { ApiTags } from '@nestjs/swagger';
import { DetailViewsDto } from './dto/request/detailViews.dto';
import { RecombeeService } from './recombee.service';
import { Body, Controller, Param, Post, Put, Query, Get } from '@nestjs/common';

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
