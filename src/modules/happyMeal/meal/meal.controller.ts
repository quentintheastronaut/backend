import { ApiTags } from '@nestjs/swagger';
import { MealService } from './meal.service';
import { Controller } from '@nestjs/common';

@ApiTags('Meal')
@Controller('meal')
export class MealController {
  constructor(private readonly _mealService: MealService) {}
}
