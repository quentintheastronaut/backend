import { NotificationsModule } from './services/notifications/notifications.module';
import { ShoppingListGateway } from './gateways/shoppingList.gateway';
import { WeightRecordModule } from './modules/happyMeal/weightRecord/weightRecord.module';
import { MeasurementModule } from './modules/happyMeal/measurement/measurement.module';
import { ShoppingListModule } from './modules/happyMeal/shoppingList/shoppingList.module';
import { IngredientModule } from './modules/happyMeal/ingredient/ingredient.module';
import { GroupModule } from './modules/happyMeal/group/group.module';
import { ClassificationModule } from './modules/vgg19/classification/classification.module';
import { AppController } from './app.controller';
import { AuthModule } from './modules/happyMeal/auth/auth.module';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppService } from './app.service';
import { UserModule } from './modules/happyMeal/user/user.module';
import { DishModule } from './modules/happyMeal/dish/dish.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import entities from './entities';
import * as dotenv from 'dotenv';
import { MenuModule } from './modules/happyMeal/menu/menu.module';
import moment from 'moment';
import { MealModule } from './modules/happyMeal/meal/meal.module';
import { LocationModule } from './modules/happyMeal/location/location.module';

dotenv.config({
  path: `.env`,
});
@Module({
  imports: [
    HttpModule,
    AuthModule,
    UserModule,
    DishModule,
    GroupModule,
    MenuModule,
    IngredientModule,
    ShoppingListModule,
    ClassificationModule,
    MeasurementModule,
    WeightRecordModule,
    LocationModule,
    MealModule,
    NotificationsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      entities: entities,
      synchronize: true,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    }),
  ],
  providers: [
    AppService,
    {
      provide: 'MomentWrapper',
      useValue: moment,
    },
    ShoppingListGateway,
  ],
  controllers: [AppController],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
