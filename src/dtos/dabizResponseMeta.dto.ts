import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class DabizResponseMetaDto {
  @ApiProperty({ example: 200 })
  @IsOptional()
  statusCode?: HttpStatus;

  @ApiProperty({ example: 'Success' })
  @IsOptional()
  @IsString()
  message?: string;

  constructor(statusCode?: HttpStatus, message?: string) {
    this.statusCode = statusCode;
    this.message = message;
  }
}
