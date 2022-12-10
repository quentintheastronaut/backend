import { UserService } from './../user/user.service';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { Module } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { MenuService } from '../menu/menu.service';

@Module({
  controllers: [GroupController],
  providers: [GroupService, UserService, AuthService, JwtService, MenuService],
  exports: [GroupService],
})
export class GroupModule {}
