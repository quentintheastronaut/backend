import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ClassifyImageDto {
  @ApiProperty({
    example: 'Quentin',
  })
  @IsOptional()
  @IsString()
  imageUrl: string;
}
