import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class AddDislikeDto {
  @ApiProperty({
    example: ['261', '262', '263'],
  })
  @IsArray()
  dishIds: Array<string>;
}
