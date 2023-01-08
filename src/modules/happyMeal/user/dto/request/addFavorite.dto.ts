import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class AddFavoriteDto {
  @ApiProperty({
    example: ['261', '262', '263'],
  })
  @IsArray()
  dishIds: Array<string>;
}
