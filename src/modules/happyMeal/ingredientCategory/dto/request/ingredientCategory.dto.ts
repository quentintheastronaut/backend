import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IngredientCategoryDto {
  @ApiProperty({
    example: 'Gia vị',
  })
  @IsString()
  name: string;
}
