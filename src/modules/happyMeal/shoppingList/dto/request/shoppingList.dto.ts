import { ShoppingListStatus } from './../../../../../constants/shoppingListStatus';
import { ShoppingListType } from './../../../../../constants/shoppingListType';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ShoppingListDto {
  @ApiProperty({
    example: '30/12/2022 18:00',
  })
  @IsOptional()
  @IsString()
  marketTime?: string;

  @ApiProperty({
    example: 'Shopping List  001',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: ShoppingListType.INDIVIDUAL,
  })
  @IsOptional()
  @IsString()
  type?: ShoppingListType;

  @ApiProperty({
    example: ShoppingListStatus.PENDING,
  })
  @IsOptional()
  @IsString()
  status?: ShoppingListStatus;

  @ApiProperty({
    example: '1',
  })
  @IsOptional()
  @IsString()
  locationId?: string;
}
