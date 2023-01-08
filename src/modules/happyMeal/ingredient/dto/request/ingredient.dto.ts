import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class IngredientDto {
  @ApiProperty({
    example: 'Chuối',
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    example: 0,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  carbohydrates: number;

  @ApiProperty({
    example: 0,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  fat: number;

  @ApiProperty({
    example: 0,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  protein: number;

  @ApiProperty({
    example: 0,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  calories: number;

  @ApiProperty({
    example: '',
  })
  @IsOptional()
  @IsString()
  imageUrl: string;

  @ApiProperty({
    example: '',
  })
  @IsOptional()
  @IsString()
  ingredientCategoryId: string;

  @ApiProperty({
    example: 0,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  suggestedPrice: number;
}
