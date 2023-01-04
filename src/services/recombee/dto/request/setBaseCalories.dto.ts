import { IsBoolean, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetBaseCaloriesDto {
  @ApiProperty({
    example: '1',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    example: 2000,
  })
  @IsNumber()
  baseCalories: number;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  cascadeCreate: boolean;
}
