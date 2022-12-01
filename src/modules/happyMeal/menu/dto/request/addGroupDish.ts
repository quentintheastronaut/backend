import { ShoppingListType } from './../../../../../constants/shoppingListType';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { MealType } from 'src/constants/mealType';

export class AddGroupDishDto {
  @ApiProperty({
    example: '1',
  })
  @IsString()
  groupId: string;

  @ApiProperty({
    example: '1',
  })
  @IsString()
  dishId: string;

  @ApiProperty({
    example: ShoppingListType.GROUP,
  })
  @IsString()
  type: ShoppingListType;

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

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  quantity: number;
}
