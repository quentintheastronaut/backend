import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GroupDto {
  @ApiProperty({
    example: 'Gia tộc họ Đặng',
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    example: '12345678',
  })
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty({
    example: '',
  })
  @IsString()
  @IsOptional()
  imageUrl: string;
}
