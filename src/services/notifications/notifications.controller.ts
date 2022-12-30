import { NotificationDto } from './dto/request/notification.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { Body, Controller, Post } from '@nestjs/common';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationController {
  constructor(private _notificationsService: NotificationsService) {}

  @Post()
  async send(@Body() notificationDto: NotificationDto) {
    return await this._notificationsService.send(notificationDto);
  }
}
