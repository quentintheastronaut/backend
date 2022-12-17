import { WeightRecordService } from './weightRecord.service';
import { WeightRecordController } from './weightRecord.controller';
import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { GroupService } from '../group/group.service';
import { MenuService } from '../menu/menu.service';
import { JwtService } from '@nestjs/jwt';
import { ShoppingListService } from '../shoppingList/shoppingList.service';
import { DishService } from '../dish/dish.service';
import { MeasurementService } from '../measurement/measurement.service';
import { IngredientService } from '../ingredient/ingredient.service';

@Module({
  controllers: [WeightRecordController],
  providers: [
    WeightRecordService,
    UserService,
    AuthService,
    GroupService,
    MenuService,
    JwtService,
    ShoppingListService,
    MeasurementService,
    DishService,
    IngredientService,
  ],
  exports: [WeightRecordService],
})
export class WeightRecordModule {}
