import { RecombeeModule } from './../../../services/recombee/recombee.module';
import { MenuService } from './../menu/menu.service';
import { JwtService } from '@nestjs/jwt';
import { ShoppingListService } from './shoppingList.service';
import { ShoppingListController } from './shoppingList.controller';
import { Logger, Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { IngredientService } from '../ingredient/ingredient.service';
import { AuthService } from '../auth/auth.service';
import { GroupService } from '../group/group.service';
import { DishService } from '../dish/dish.service';
import { MeasurementService } from '../measurement/measurement.service';
import { NotificationsService } from 'src/services/notifications/notifications.service';

@Module({
  controllers: [ShoppingListController],
  imports: [RecombeeModule],
  providers: [
    ShoppingListService,
    UserService,
    IngredientService,
    AuthService,
    JwtService,
    GroupService,
    DishService,
    MenuService,
    MeasurementService,
    NotificationsService,
    Logger,
  ],
  exports: [ShoppingListService],
})
export class ShoppingListModule {}
