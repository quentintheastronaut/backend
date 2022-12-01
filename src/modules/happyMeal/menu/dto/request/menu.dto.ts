import { ShoppingListType } from 'src/constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class MenuDto {
  @ApiProperty({
    example: '01/12/2022',
  })
  @IsString()
  date: string;

  @ApiProperty({
    example: ShoppingListType.INDIVIDUAL,
  })
  @IsString()
  type: ShoppingListType;
}
