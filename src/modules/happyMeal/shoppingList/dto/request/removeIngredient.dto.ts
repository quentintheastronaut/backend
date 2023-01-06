import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RemoveIngredientDto {
  @ApiProperty({
    example: 1,
  })
  @IsString()
  ingredientToShoppingListId: string;
}
