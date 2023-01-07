import { FoodCategoryService } from './foodCategory.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Param, Post, Query } from '@nestjs/common';
import { FoodCategoryDto } from './dto/request/foodCategory.dto';
import { FoodCategory } from 'src/entities/FoodCategory';
import { PageDto, PageOptionsDto } from 'src/dtos';
import { ApiPaginatedResponse } from 'src/decorators';
import { Get } from '@nestjs/common';
import { Patch } from '@nestjs/common';
@ApiTags('Food Category')
@Controller('food-category')
export class FoodCategoryController {
  constructor(private readonly _foodCategoryService: FoodCategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create' })
  async createIngredient(
    @Body() foodCategoryDto: FoodCategoryDto,
  ): Promise<PageDto<FoodCategory>> {
    return this._foodCategoryService.createFoodCategory(foodCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get' })
  @ApiPaginatedResponse(FoodCategory)
  async getAllIngredients(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<FoodCategory[]>> {
    return this._foodCategoryService.getAllFoodCategories(pageOptionsDto);
  }

  @ApiOperation({ summary: 'Update' })
  @Patch('/:id')
  async addIngredient(
    @Param('id') id: string,
    @Body() foodCategoryDto: FoodCategoryDto,
  ) {
    return this._foodCategoryService.updateFoodCategory(id, foodCategoryDto);
  }

  @ApiOperation({ summary: 'Delete' })
  @Delete(':id')
  async removeIngredient(@Param('id') id: string) {
    return this._foodCategoryService.removeFoodCategory(id);
  }
}
