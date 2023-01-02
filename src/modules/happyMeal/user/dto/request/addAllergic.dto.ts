import { IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class AddAllergicDto {
  @ApiProperty({
    example: ['811', '812', '813'],
  })
  @IsArray()
  ingredientIds: Array<string>;
}
