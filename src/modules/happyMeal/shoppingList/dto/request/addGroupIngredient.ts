import { ShoppingListType } from './../../../../../constants/shoppingListType';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AddGroupIngredientDto {
  @ApiProperty({
    example: '1',
  })
  @IsString()
  groupId: string;

  @ApiProperty({
    example: '1',
  })
  @IsString()
  ingredientId: string;

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
    example: 0,
  })
  @IsNumber()
  weight: number;

  @ApiProperty({
    example: 'GRAMME',
  })
  @IsString()
  measurementType: string;

  @ApiProperty({
    example: ShoppingListType.GROUP,
    default: ShoppingListType.GROUP,
  })
  @IsString()
  type: ShoppingListType;
}
