import { IngredientService } from './ingredient.service';
import { IngredientController } from './ingredient.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [IngredientController],
  providers: [IngredientService],
  exports: [IngredientService],
})
export class IngredientModule {}
