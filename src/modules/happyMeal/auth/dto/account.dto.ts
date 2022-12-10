import { AccountRole } from 'src/constants/accountRole';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AccountDto {
  @ApiProperty({
    example: 'user_1@gmail.com',
  })
  @IsEmail()
  email?: string;

  @IsString()
  @ApiProperty({
    example: 'happymeal',
  })
  password?: string;

  @IsString()
  @ApiProperty({
    example: AccountRole.USER,
  })
  role?: AccountRole;
}
