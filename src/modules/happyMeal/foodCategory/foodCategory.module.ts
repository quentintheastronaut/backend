import { FoodCategoryService } from './foodCategory.service';
import { FoodCategoryController } from './foodCategory.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [FoodCategoryController],
  providers: [FoodCategoryService],
  exports: [FoodCategoryService],
})
export class FoodCategoryModule {}
