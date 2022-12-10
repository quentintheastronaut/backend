import { GroupService } from './../group/group.service';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Module } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { MenuService } from '../menu/menu.service';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [UserService, GroupService, MenuService],
  exports: [UserService],
})
export class UserModule {}
