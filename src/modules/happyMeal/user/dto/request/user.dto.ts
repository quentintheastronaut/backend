import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { SexType } from 'src/constants/sexType';

export class UserDto {
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
    example: '',
  })
  @IsOptional()
  activityIntensity?: string;

  @ApiProperty({
    example: 'user_1@gmail.com',
  })
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: true,
  })
  @IsOptional()
  active?: boolean;

  @ApiProperty({
    default: 'happymeal',
  })
  @IsOptional()
  password?: string;
}
