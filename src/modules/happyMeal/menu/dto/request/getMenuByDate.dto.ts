import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetMenuByDateDto {
  @ApiProperty({
    example: '20/11/2022',
  })
  @IsString()
  date: string;
}
