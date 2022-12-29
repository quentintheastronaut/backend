import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LocationDto {
  @ApiProperty({
    example: 'Bách hoá xanh',
  })
  @IsString()
  name: string;
}
