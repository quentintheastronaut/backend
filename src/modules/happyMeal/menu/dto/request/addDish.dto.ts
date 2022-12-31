import { ShoppingListType } from './../../../../../constants/shoppingListType';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { MealType } from 'src/constants/mealType';

export class AddDishDto {
  @ApiProperty({
    example: '1',
  })
  @IsString()
  dishId: string;

  @ApiProperty({
    example: '1',
  })
  @IsString()
  mealId: string;

  @ApiProperty({
    example: ShoppingListType.INDIVIDUAL,
  })
  @IsString()
  type: ShoppingListType;

  @ApiProperty({
    example: '30/10/2022',
  })
  @IsString()
  date: string;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    example: '',
  })
  @IsNumber()
  note: string;
}
