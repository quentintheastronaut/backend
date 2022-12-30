import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class AddFavoriteDto {
  @ApiProperty({
    example: '811',
  })
  @IsString()
  ingredientId: string;
}
