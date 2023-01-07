import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FoodCategoryDto {
  @ApiProperty({
    example: 'Ẩm thực đường phố',
  })
  @IsString()
  name: string;
}
