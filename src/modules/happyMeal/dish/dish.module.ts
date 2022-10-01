import { DishRepository } from './../../../repositories/dish.repository';
import { DishService } from './dish.service';
import { DishController } from './dish.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [DishController],
  providers: [DishService, DishRepository],
})
export class DishModule {}
