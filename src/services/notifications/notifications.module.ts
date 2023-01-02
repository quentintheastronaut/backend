import { NotificationController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { Logger, Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [NotificationController],
  providers: [NotificationsService, Logger],
  exports: [NotificationsService],
})
export class NotificationsModule {}
