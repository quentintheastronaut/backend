import { RecombeeModule } from './../../../services/recombee/recombee.module';
import { DishRepository } from './../../../repositories/dish.repository';
import { DishService } from './dish.service';
import { DishController } from './dish.controller';
import { Module } from '@nestjs/common';
import { IngredientService } from '../ingredient/ingredient.service';
import { MeasurementService } from '../measurement/measurement.service';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [DishController],
  imports: [RecombeeModule, UserModule],
  providers: [
    DishService,
    DishRepository,
    IngredientService,
    MeasurementService,
  ],
  exports: [DishService],
})
export class DishModule {}
