import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class AddAllergicDto {
  @ApiProperty({
    example: '811',
  })
  @IsString()
  ingredientId: string;
}
