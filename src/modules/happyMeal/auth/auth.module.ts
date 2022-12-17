import { GroupService } from './../group/group.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { MenuService } from '../menu/menu.service';
import { ShoppingListService } from '../shoppingList/shoppingList.service';
import { DishService } from '../dish/dish.service';
import { IngredientService } from '../ingredient/ingredient.service';
import { MeasurementService } from '../measurement/measurement.service';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtService,
    UserService,
    GroupService,
    MenuService,
    DishService,
    ShoppingListService,
    IngredientService,
    MeasurementService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
