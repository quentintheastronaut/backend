import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @ApiProperty({
    example: 'happymeal',
  })
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'happymeal',
  })
  newPassword: string;
}
