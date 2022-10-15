import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
