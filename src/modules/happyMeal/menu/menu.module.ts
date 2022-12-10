import { JwtService } from '@nestjs/jwt';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { GroupService } from '../group/group.service';

@Module({
  controllers: [MenuController],
  providers: [MenuService, UserService, AuthService, JwtService, GroupService],
  exports: [MenuService],
})
export class MenuModule {}
