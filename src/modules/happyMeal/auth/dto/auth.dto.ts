import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    example: 'user_1@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'happymeal',
  })
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  token: string;
}
