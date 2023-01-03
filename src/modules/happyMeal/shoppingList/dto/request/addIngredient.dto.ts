import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AddIngredientDto {
  @ApiProperty({
    example: '1',
  })
  @IsString()
  ingredientId: string;

  @ApiProperty({
    example: '1',
  })
  @IsString()
  @IsOptional()
  individualShoppingListId?: string;

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
