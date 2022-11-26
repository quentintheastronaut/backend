import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CheckDto {
  @ApiProperty({
    example: '1',
  })
  @IsString()
  ingredientToShoppingListId: string;
}
