import { ShoppingListStatus } from './../../../../../constants/shoppingListStatus';
import { ShoppingListType } from './../../../../../constants/shoppingListType';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ShoppingListDto {
  @ApiProperty({
    example: '18:00',
  })
  @IsOptional()
  @IsString()
  marketTime: string;

  @ApiProperty({
    example: ShoppingListType.INDIVIDUAL,
  })
  @IsOptional()
  @IsString()
  type: ShoppingListType;

  @ApiProperty({
    example: ShoppingListStatus.PENDING,
  })
  @IsOptional()
  @IsString()
  status: ShoppingListStatus;

  @ApiProperty({
    example: 12,
  })
  @IsOptional()
  @IsString()
  groupId: number;

  @ApiProperty({
    example: 11,
  })
  @IsOptional()
  @IsString()
  userId: number;
}
