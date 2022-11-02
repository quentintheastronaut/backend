import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RemoveMemberDto {
  @ApiProperty({
    example: '3',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    example: '1',
  })
  @IsString()
  groupId: string;
}
