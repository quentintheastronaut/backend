import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TrackDto {
  @ApiProperty({
    example: '1',
  })
  @IsString()
  dishToMenuId: string;
}
