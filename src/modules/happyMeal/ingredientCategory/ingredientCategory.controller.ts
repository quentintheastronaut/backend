import { IngredientCategoryService } from './ingredientCategory.service';
import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IngredientCategoryDto } from './dto/request/ingredientCategory.dto';
import { IngredientCategory } from 'src/entities/IngredientCategory';
import { PageDto, PageOptionsDto } from 'src/dtos';
import { Get } from '@nestjs/common';
import { ApiPaginatedResponse } from 'src/decorators';
import { Query } from '@nestjs/common';
import { Delete } from '@nestjs/common';

@ApiTags('Ingredient Category')
@Controller('ingredient-category')
export class IngredientCategoryController {
  constructor(
    private readonly _ingredientCategoryService: IngredientCategoryService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create' })
  async createIngredient(
    @Body() ingredientCategoryDto: IngredientCategoryDto,
  ): Promise<PageDto<IngredientCategory>> {
    return this._ingredientCategoryService.createIngredientCategory(
      ingredientCategoryDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get' })
  @ApiPaginatedResponse(IngredientCategory)
  async getAllIngredients(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<IngredientCategory[]>> {
    return this._ingredientCategoryService.getAllIngredientCategories(
      pageOptionsDto,
    );
  }

  @ApiOperation({ summary: 'Update' })
  @Patch('/:id')
  async addIngredient(
    @Param('id') id: string,
    @Body() ingredientCategoryDto: IngredientCategoryDto,
  ) {
    return this._ingredientCategoryService.updateIngredientCategory(
      id,
      ingredientCategoryDto,
    );
  }

  @ApiOperation({ summary: 'Delete' })
  @Delete(':id')
  async removeIngredient(@Param('id') id: string) {
    return this._ingredientCategoryService.removeIngredientCategory(id);
  }
}
