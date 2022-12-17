import { ShoppingListService } from './../shoppingList/shoppingList.service';
import { JwtService } from '@nestjs/jwt';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { GroupService } from '../group/group.service';
import { DishService } from '../dish/dish.service';
import { IngredientService } from '../ingredient/ingredient.service';
import { MeasurementService } from '../measurement/measurement.service';

@Module({
  controllers: [MenuController],
  providers: [
    MenuService,
    UserService,
    AuthService,
    JwtService,
    DishService,
    GroupService,
    ShoppingListService,
    IngredientService,
    MeasurementService,
    MenuService,
  ],
  exports: [MenuService],
})
export class MenuModule {}
