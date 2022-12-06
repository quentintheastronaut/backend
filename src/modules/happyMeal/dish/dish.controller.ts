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
import { AddIngredientToDishDto } from './dto/request/addIngredient.dto';

@ApiTags('Dish')
@Controller('dish')
export class DishController {
  constructor(private readonly _dishService: DishService) {}

  @Get('/ingredient/:id')
  @ApiPaginatedResponse(Dish)
  async getIngredient(@Param('id') dishId: string) {
    return this._dishService.getIngredient(dishId);
  }

  @Post('/add-ingredient')
  async addIngredient(@Body() addIngredientDto: AddIngredientToDishDto) {
    return this._dishService.addIngredient(addIngredientDto);
  }

  @Patch('/update-ingredient')
  async updateIngredient(@Body() addIngredientDto: AddIngredientToDishDto) {
    return this._dishService.updateIngredient(addIngredientDto);
  }

  @Delete('/remove-ingredient/:id')
  async removeIngredient(@Param('id') id: number) {
    return this._dishService.removeIngredient(id);
  }

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
