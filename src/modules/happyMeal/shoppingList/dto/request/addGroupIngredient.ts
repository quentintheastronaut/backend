import { ShoppingListType } from './../../../../../constants/shoppingListType';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class AddGroupIngredientDto {
  @ApiProperty({
    example: '1',
  })
  @IsString()
  @IsOptional()
  groupShoppingListId?: string;

  @ApiProperty({
    example: '1',
  })
  @IsString()
  ingredientId: string;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    example: '4',
  })
  @IsString()
  measurementTypeId: string;

  @ApiProperty({
    example: '',
  })
  @IsString()
  public note: string;
}
