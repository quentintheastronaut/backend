import { NotificationController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [NotificationController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
