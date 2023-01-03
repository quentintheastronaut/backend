import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AssignMarketerDto {
  @ApiProperty({
    example: '5',
  })
  @IsString()
  groupShoppingListId: string;
}
