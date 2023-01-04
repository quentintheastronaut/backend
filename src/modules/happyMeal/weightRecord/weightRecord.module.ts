import { RecombeeModule } from './../../../services/recombee/recombee.module';
import { WeightRecordService } from './weightRecord.service';
import { WeightRecordController } from './weightRecord.controller';
import { Logger, Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { GroupService } from '../group/group.service';
import { MenuService } from '../menu/menu.service';
import { JwtService } from '@nestjs/jwt';
import { ShoppingListService } from '../shoppingList/shoppingList.service';
import { DishService } from '../dish/dish.service';
import { MeasurementService } from '../measurement/measurement.service';
import { IngredientService } from '../ingredient/ingredient.service';
import { NotificationsService } from 'src/services/notifications/notifications.service';

@Module({
  controllers: [WeightRecordController],
  imports: [RecombeeModule],
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
    NotificationsService,
    Logger,
  ],
  exports: [WeightRecordService],
})
export class WeightRecordModule {}
