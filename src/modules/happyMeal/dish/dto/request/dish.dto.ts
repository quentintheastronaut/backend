import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class DishDto {
  @ApiProperty({
    example: 'Cơm tấm',
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
  slug: string;

  @ApiProperty({
    example: '',
  })
  @IsOptional()
  @IsString()
  recipeId: string;

  @ApiProperty({
    example: '',
  })
  @IsOptional()
  @IsString()
  description: string;
}
