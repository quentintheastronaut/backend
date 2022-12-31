import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { MealType } from 'src/constants/mealType';

export class UpdateDishToMenuDto {
  @ApiProperty({
    example: '1',
  })
  @IsString()
  dishToMenuId: string;

  @ApiProperty({
    example: '1',
  })
  @IsString()
  mealId: string;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  quantity: number;

  @ApiProperty({
    example: '',
  })
  @IsNumber()
  note: string;
}
