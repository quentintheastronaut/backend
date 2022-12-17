import { PageDto } from 'src/dtos/page.dto';
import { ApiTags } from '@nestjs/swagger';
import { MealService } from './meal.service';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiPaginatedResponse } from 'src/decorators';
import { Meal } from 'src/entities/Meal';
import { PageOptionsDto } from 'src/dtos';

@ApiTags('Meal')
@Controller('meal')
export class MealController {
  constructor(private readonly _mealService: MealService) {}

  @Get()
  @ApiPaginatedResponse(Meal)
  async getAllDishes(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Meal[]>> {
    return this._mealService.getAllMeal(pageOptionsDto);
  }
}
