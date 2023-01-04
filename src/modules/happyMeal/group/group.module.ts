import { RecombeeModule } from './../../../services/recombee/recombee.module';
import { NotificationsService } from 'src/services/notifications/notifications.service';
import { WeightRecordService } from './../weightRecord/weightRecord.service';
import { UserService } from './../user/user.service';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { Module, Logger } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { MenuService } from '../menu/menu.service';
import { ShoppingListService } from '../shoppingList/shoppingList.service';
import { DishService } from '../dish/dish.service';
import { IngredientService } from '../ingredient/ingredient.service';
import { MeasurementService } from '../measurement/measurement.service';

@Module({
  controllers: [GroupController],
  imports: [RecombeeModule],
  providers: [
    GroupService,
    UserService,
    AuthService,
    JwtService,
    DishService,
    MenuService,
    ShoppingListService,
    IngredientService,
    WeightRecordService,
    MeasurementService,
    NotificationsService,
    Logger,
  ],
  exports: [GroupService],
})
export class GroupModule {}
