import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { SexType } from 'src/constants/sexType';

export class UpdateProfileDto {
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
    example: '170',
  })
  @IsOptional()
  height?: number;

  @ApiProperty({
    example: '70',
  })
  @IsOptional()
  weight?: number;

  @ApiProperty({
    example: '22',
  })
  @IsOptional()
  age?: number;

  @ApiProperty({
    example:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/OOjs_UI_icon_userAvatar-progressive.svg/1200px-OOjs_UI_icon_userAvatar-progressive.svg.png',
  })
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    example: '70',
  })
  @IsOptional()
  healthGoal?: string;

  @ApiProperty({
    example: '65',
  })
  @IsOptional()
  desiredWeight?: number;

  @ApiProperty({
    example: true,
  })
  @IsOptional()
  status?: boolean;

  @ApiProperty({
    example: '',
  })
  @IsOptional()
  activityIntensity?: string;

  @ApiProperty({
    example: 'user_1@gmail.com',
  })
  @IsOptional()
  email?: string;
}
