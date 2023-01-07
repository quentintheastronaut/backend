import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IncompatibleDto {
  @ApiProperty({
    example: '1',
  })
  @IsString()
  firstIngredient: string;

  @ApiProperty({
    example: '1',
  })
  @IsString()
  secondIngredient: string;

  @ApiProperty({
    example: 'Ngộ độc thực phẩm',
  })
  @IsString()
  note: string;
}
