import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class AddDislikeDto {
  @ApiProperty({
    example: '811',
  })
  @IsString()
  dishId: string;
}
