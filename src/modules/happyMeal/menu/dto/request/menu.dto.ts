import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class MenuDto {
  @ApiProperty({
    example: '30/10/2022',
  })
  @IsString()
  date: string;
}
