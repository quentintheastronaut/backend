import { IngredientService } from './ingredient.service';
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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PageDto, PageOptionsDto } from 'src/dtos';
import { Ingredient } from 'src/entities/Ingredient';
import { IngredientDto } from './dto/request/ingredient.dto';
import { ApiPaginatedResponse } from 'src/decorators';

@ApiTags('Ingredient')
@ApiBearerAuth()
@Controller('ingredient')
export class IngredientController {
  constructor(private readonly _ingredientService: IngredientService) {}

  @Patch(':id')
  async updateIngredient(
    @Param('id') id: number,
    @Body() ingredientDto: IngredientDto,
  ): Promise<PageDto<Ingredient>> {
    return this._ingredientService.updateIngredient(id, ingredientDto);
  }

  @Post()
  async createIngredient(
    @Body() ingredientDto: IngredientDto,
  ): Promise<PageDto<Ingredient>> {
    return this._ingredientService.createIngredient(ingredientDto);
  }

  @Delete(':id')
  async deleteIngredient(
    @Param('id') id: number,
  ): Promise<PageDto<Ingredient>> {
    return this._ingredientService.deleteIngredient(id);
  }

  @Get()
  @ApiPaginatedResponse(Ingredient)
  async getAllIngredients(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Ingredient>> {
    return this._ingredientService.getAllIngredients(pageOptionsDto);
  }
}
