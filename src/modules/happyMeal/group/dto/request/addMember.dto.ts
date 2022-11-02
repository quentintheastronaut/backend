import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddMemberDto {
  @ApiProperty({
    example: 'user_2@gmail.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    example: '1',
  })
  @IsString()
  groupId: string;
}
