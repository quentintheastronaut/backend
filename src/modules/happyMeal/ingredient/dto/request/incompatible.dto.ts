import { IsString, IsOptional } from 'class-validator';
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
  @IsOptional()
  note?: string;
}
