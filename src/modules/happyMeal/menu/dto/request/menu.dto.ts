import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class MenuDto {
  @ApiProperty({
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  date: number;
}
