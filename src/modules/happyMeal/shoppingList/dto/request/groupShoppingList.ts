import { ShoppingListStatus } from './../../../../../constants/shoppingListStatus';
import { ShoppingListType } from './../../../../../constants/shoppingListType';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GroupShoppingListDto {
  @ApiProperty({
    example: '30/10/2022',
  })
  @IsString()
  date: string;

  @ApiProperty({
    example: 12,
  })
  @IsOptional()
  @IsString()
  groupId: string;

  @ApiProperty({
    example: 12,
  })
  @IsOptional()
  @IsString()
  shoppingListId: string;
}
