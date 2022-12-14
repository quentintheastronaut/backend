import { MenuService } from './../menu/menu.service';
import { JwtService } from '@nestjs/jwt';
import { ShoppingListService } from './shoppingList.service';
import { ShoppingListController } from './shoppingList.controller';
import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { IngredientService } from '../ingredient/ingredient.service';
import { AuthService } from '../auth/auth.service';
import { GroupService } from '../group/group.service';
import { DishService } from '../dish/dish.service';

@Module({
  controllers: [ShoppingListController],
  providers: [
    ShoppingListService,
    UserService,
    IngredientService,
    AuthService,
    JwtService,
    GroupService,
    DishService,
    MenuService,
  ],
  exports: [ShoppingListService],
})
export class ShoppingListModule {}
