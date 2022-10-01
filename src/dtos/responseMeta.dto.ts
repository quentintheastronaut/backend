import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ResponseMetaDto {
  @ApiProperty({ example: 200 })
  @IsOptional()
  statusCode?: HttpStatus;

  @ApiProperty({ example: 'Success' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: 'Success' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({ example: '' })
  @IsOptional()
  @IsString()
  detail?: string;

  constructor(
    statusCode?: HttpStatus,
    status?: string,
    detail?: string,
    message?: string,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.status = status;
    this.detail = detail;
  }
}
