import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class AddDislikeDto {
  @ApiProperty({
    example: ['216', '217', '218'],
  })
  @IsArray()
  dishIds: Array<string>;
}
