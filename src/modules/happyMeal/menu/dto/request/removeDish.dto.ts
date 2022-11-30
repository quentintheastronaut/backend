import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RemoveDishDto {
  @ApiProperty({
    example: 1,
  })
  @IsString()
  dishToMenuId: string;
}
