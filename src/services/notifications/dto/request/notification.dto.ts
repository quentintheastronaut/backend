import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class NotificationDto {
  @ApiProperty({
    example:
      'AAAAkXKk_I4:APA91bHAqns6wq3xJzrNtiLCb5xrqABcTrdIXAcdKVysYXphK9FFKKLmls9OU-FxV398ehI7gvah7JUi0S7vvTrFtQ01jYU50oebFpA9T0FmU8Y2bjs4jxAO5Pyb7NK2JYQhF81ZHp06',
  })
  @IsString()
  token: string;

  @ApiProperty({
    example: 'Happy Meal Notification',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: "This is Happy Meal Notification's body",
  })
  @IsString()
  body: string;
}
