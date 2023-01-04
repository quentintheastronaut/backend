import { RecombeeModule } from './../../../services/recombee/recombee.module';
import { GroupService } from './../group/group.service';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Logger, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MenuService } from '../menu/menu.service';
import { ShoppingListService } from '../shoppingList/shoppingList.service';
import { DishService } from '../dish/dish.service';
import { IngredientService } from '../ingredient/ingredient.service';
import { MeasurementService } from '../measurement/measurement.service';
import { NotificationsService } from 'src/services/notifications/notifications.service';

@Module({
  imports: [AuthModule, RecombeeModule],
  controllers: [UserController],
  providers: [
    UserService,
    GroupService,
    MenuService,
    ShoppingListService,
    DishService,
    IngredientService,
    MeasurementService,
    NotificationsService,
    Logger,
  ],
  exports: [UserService],
})
export class UserModule {}
