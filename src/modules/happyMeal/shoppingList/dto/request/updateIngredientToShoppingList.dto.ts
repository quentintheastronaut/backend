import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateIngredientToShoppingListDto {
  @ApiProperty({
    example: '1',
  })
  @IsString()
  ingredientToShoppingListId: string;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  quantity?: number;

  @ApiProperty({
    example: '4',
  })
  @IsOptional()
  @IsString()
  measurementTypeId?: string;

  @ApiProperty({
    example: '',
  })
  @IsString()
  public note: string;
}
