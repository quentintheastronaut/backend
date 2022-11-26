import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class MeasurementDto {
  @ApiProperty({
    example: 'TÔ',
  })
  @IsOptional()
  @IsString()
  name: string;
}
