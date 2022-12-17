import { AccountRole } from 'src/constants/accountRole';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SexType } from 'src/constants';

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

  @ApiProperty({
    example: 'Quentin',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    example: 'Dang',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    example: SexType.MALE,
  })
  @IsOptional()
  sex?: SexType;

  @ApiProperty({
    example: '12/06/2022',
  })
  @IsOptional()
  dob?: string;

  @ApiProperty({
    example:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/OOjs_UI_icon_userAvatar-progressive.svg/1200px-OOjs_UI_icon_userAvatar-progressive.svg.png',
  })
  @IsOptional()
  imageUrl?: string;
}
