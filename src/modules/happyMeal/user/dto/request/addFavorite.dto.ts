import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class AddFavoriteDto {
  @ApiProperty({
    example: ['216', '217', '218'],
  })
  @IsArray()
  dishIds: Array<string>;
}
