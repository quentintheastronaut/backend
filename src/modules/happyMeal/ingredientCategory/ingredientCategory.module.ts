import { IngredientCategoryService } from './ingredientCategory.service';
import { IngredientCategoryController } from './ingredientCategory.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [IngredientCategoryController],
  providers: [IngredientCategoryService],
  exports: [IngredientCategoryService],
})
export class IngredientCategoryModule {}
