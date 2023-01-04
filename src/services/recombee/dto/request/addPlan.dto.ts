import { IsBoolean, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddPlanDto {
  @ApiProperty({
    example: '1',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    example: '261',
  })
  @IsString()
  itemId: string;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  cascadeCreate: boolean;
}
