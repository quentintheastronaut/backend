import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AddIngredientToDishDto {
  @ApiProperty({
    example: '1',
  })
  @IsString()
  ingredientId: string;

  @ApiProperty({
    example: '1',
  })
  @IsString()
  dishId: string;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    example: 0,
  })
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiProperty({
    example: 'GRAMME',
  })
  @IsString()
  measurementType: string;
}
