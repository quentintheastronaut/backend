import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AddIngredientDto {
  @ApiProperty({
    example: '1',
  })
  @IsString()
  ingredientId: string;

  @ApiProperty({
    example: '30/10/2022',
  })
  @IsString()
  date: string;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    example: '4',
  })
  @IsString()
  measurementTypeId: string;

  @ApiProperty({
    example: '4',
  })
  @IsString()
  locationId: string;

  @ApiProperty({
    example: '',
  })
  @IsString()
  public note: string;
}
