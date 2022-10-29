import { DishDto } from './dto/request/dish.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PageDto, PageOptionsDto } from 'src/dtos';
import { Dish } from 'src/entities/Dish';
import { DishService } from './dish.service';
import { ApiPaginatedResponse } from 'src/decorators/api-paginated-response.decorator';

@ApiTags('Dish')
@Controller('dish')
export class DishController {
  constructor(private readonly _dishService: DishService) {}

  @Patch(':id')
  async updateDish(
    @Param('id') id: number,
    @Body() dishDto: DishDto,
  ): Promise<PageDto<Dish>> {
    return this._dishService.updateDish(id, dishDto);
  }

  @Post()
  async createDish(@Body() dishDto: DishDto): Promise<PageDto<Dish>> {
    return this._dishService.createDish(dishDto);
  }

  @Delete(':id')
  async deleteDish(@Param('id') id: number): Promise<PageDto<Dish>> {
    return this._dishService.deleteDish(id);
  }

  @Get()
  @ApiPaginatedResponse(Dish)
  async getAllDishes(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Dish[]>> {
    return this._dishService.getAllDishes(pageOptionsDto);
  }

  @Get(':id')
  @ApiPaginatedResponse(Dish)
  async getDishDetail(@Param('id') id: string): Promise<PageDto<Dish>> {
    return this._dishService.getDishDetail(id);
  }
}
