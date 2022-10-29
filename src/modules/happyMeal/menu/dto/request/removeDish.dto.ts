import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { MealType } from 'src/constants/mealType';

export class RemoveDishDto {
  @ApiProperty({
    example: 1,
  })
  @IsString()
  dishId: string;

  @ApiProperty({
    example: '30/10/2022',
  })
  @IsString()
  date: string;

  @ApiProperty({
    example: MealType.BREAKFAST,
  })
  @IsString()
  meal: MealType;
}
