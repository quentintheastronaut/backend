import { ShoppingListType } from './../../../../../constants/shoppingListType';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AddGroupDishDto {
  @ApiProperty({
    example: '1',
  })
  @IsString()
  groupId: string;

  @ApiProperty({
    example: '1',
    default: '',
  })
  @IsString()
  @IsOptional()
  groupShoppingListId: string;

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
    example: '1',
  })
  @IsString()
  mealId: string;

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
