import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DishModule } from './dish/dish.module';
import { InjectDataSource, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import entities from './enitity';

@Module({
  imports: [
    AuthModule,
    UserModule,
    DishModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'us-cdbr-east-05.cleardb.net',
      port: 3306,
      username: 'b1debf5dc6925d',
      password: '4e5f4ab8',
      database: 'heroku_9d924f8e65061f6',
      entities: entities,
      synchronize: true,
    }),
  ],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
