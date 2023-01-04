import { IsBoolean, IsOptional, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetAllergicDto {
  @ApiProperty({
    example: '1',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    example: ['261', '262', '263'],
  })
  @IsArray()
  allergic: Array<string>;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  cascadeCreate: boolean;
}
