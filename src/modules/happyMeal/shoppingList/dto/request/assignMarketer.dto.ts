import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AssignMarketerDto {
  @ApiProperty({
    example: '06/12/2022',
  })
  @IsString()
  date: string;

  @ApiProperty({
    example: '1',
  })
  @IsString()
  groupId: string;
}
