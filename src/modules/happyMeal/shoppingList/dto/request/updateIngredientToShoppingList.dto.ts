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
    example: 0,
  })
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiProperty({
    example: 'GRAMME',
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
