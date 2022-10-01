import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
