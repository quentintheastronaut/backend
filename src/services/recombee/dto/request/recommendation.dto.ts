import { IsBoolean, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecommendationDto {
  @ApiProperty({
    example: '1',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    example: 4,
  })
  @IsNumber()
  count: number;
}
