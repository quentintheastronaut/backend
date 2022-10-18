import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ClassifyImageDto {
  @ApiProperty({
    example:
      'https://statics.vinpearl.com/com-tam-ngon-o-sai-gon-0_1630562640.jpg',
  })
  @IsOptional()
  @IsString()
  image: string;
}
