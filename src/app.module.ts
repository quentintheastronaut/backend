import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DishModule } from './dish/dish.module';

@Module({
  imports: [AuthModule, UserModule, DishModule],
  providers: [AppService],
})
export class AppModule {}
