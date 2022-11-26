import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { MealType } from 'src/constants/mealType';

export class RemoveIngredientDto {
  @ApiProperty({
    example: 1,
  })
  @IsString()
  ingredientToShoppingListId: string;

  @ApiProperty({
    example: '30/10/2022',
  })
  @IsString()
  date: string;
}
