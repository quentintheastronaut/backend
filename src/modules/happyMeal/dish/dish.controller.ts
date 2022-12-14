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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({ summary: "Get a dish's ingredient" })
  async getIngredient(@Param('id') dishId: string) {
    return this._dishService.getIngredient(dishId);
  }

  @ApiOperation({ summary: "Add a dish's ingredient" })
  @Post('/add-ingredient')
  async addIngredient(@Body() addIngredientDto: AddIngredientToDishDto) {
    return this._dishService.addIngredient(addIngredientDto);
  }

  @Patch('/update-ingredient')
  @ApiOperation({ summary: 'Update ingredient of a dish' })
  async updateIngredient(@Body() addIngredientDto: AddIngredientToDishDto) {
    return this._dishService.updateIngredient(addIngredientDto);
  }

  @ApiOperation({ summary: 'Remove ingredient of a dish' })
  @Delete('/remove-ingredient/:id')
  async removeIngredient(@Param('id') id: number) {
    return this._dishService.removeIngredient(id);
  }

  @ApiOperation({ summary: 'Update dish' })
  @Patch(':id')
  async updateDish(
    @Param('id') id: number,
    @Body() dishDto: DishDto,
  ): Promise<PageDto<Dish>> {
    return this._dishService.updateDish(id, dishDto);
  }

  @ApiOperation({ summary: 'Create dish' })
  @Post()
  async createDish(@Body() dishDto: DishDto): Promise<PageDto<Dish>> {
    return this._dishService.createDish(dishDto);
  }

  @ApiOperation({ summary: 'Delete dish' })
  @Delete(':id')
  async deleteDish(@Param('id') id: number): Promise<PageDto<Dish>> {
    return this._dishService.deleteDish(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all dish' })
  @ApiPaginatedResponse(Dish)
  async getAllDishes(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Dish[]>> {
    return this._dishService.getAllDishes(pageOptionsDto);
  }

  @ApiOperation({ summary: "Get a dish's detail" })
  @Get(':id')
  @ApiPaginatedResponse(Dish)
  async getDishDetail(@Param('id') id: string): Promise<PageDto<Dish>> {
    return this._dishService.getDishDetail(id);
  }
}
