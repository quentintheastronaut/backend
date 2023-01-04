import { IsBoolean, IsOptional, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetIngredientDto {
  @ApiProperty({
    example: '1',
  })
  @IsString()
  itemId: string;

  @ApiProperty({
    example: ['261', '262', '263'],
  })
  @IsArray()
  ingredient: Array<string>;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  cascadeCreate: boolean;
}
