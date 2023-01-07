import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LocationDto {
  @ApiProperty({
    example: 'Bách hoá xanh Tân Hương',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '348 Tân Hương, Tân Quý, Tân Phú, Thành phố Hồ Chí Minh 700000',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    example: '10.789752960732981',
  })
  @IsString()
  @IsOptional()
  longitude?: string;

  @ApiProperty({
    example: '106.61800314968305',
  })
  @IsString()
  @IsOptional()
  latitude?: string;
}
