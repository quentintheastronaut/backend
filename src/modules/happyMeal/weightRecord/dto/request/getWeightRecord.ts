import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetWeightRecordsDto {
  @ApiProperty({
    example: '01/12/2022',
  })
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    example: '31/12/2022',
  })
  @IsOptional()
  endDate?: string;
}
