import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { MealType } from 'src/constants/mealType';

export class UpdateDishToMenuDto {
  @ApiProperty({
    example: '1',
  })
  @IsString()
  dishToMenuId: string;

  @ApiProperty({
    example: MealType.BREAKFAST,
  })
  @IsString()
  meal: MealType;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  quantity: number;
}
