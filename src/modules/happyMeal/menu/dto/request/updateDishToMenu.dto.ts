import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { DishType } from 'src/constants/dishType';
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
    example: DishType.COOKING,
  })
  @IsString()
  dishType: DishType;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  quantity: number;

  @ApiProperty({
    example: '',
  })
  @IsString()
  note: string;
}
