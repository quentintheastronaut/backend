import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateWeightDto {
  @ApiProperty({
    example: 70,
  })
  @IsOptional()
  weight?: number;
}
