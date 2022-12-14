import { GroupService } from './../group/group.service';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Module } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { MenuService } from '../menu/menu.service';
import { ShoppingListService } from '../shoppingList/shoppingList.service';
import { DishService } from '../dish/dish.service';
import { IngredientService } from '../ingredient/ingredient.service';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [
    UserService,
    GroupService,
    MenuService,
    ShoppingListService,
    DishService,
    IngredientService,
  ],
  exports: [UserService],
})
export class UserModule {}
