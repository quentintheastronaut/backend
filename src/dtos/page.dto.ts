import { HttpStatus } from '@nestjs/common';
import { ResponseMetaDto } from './responseMeta.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { PageMetaDto } from './pageMeta.dto';

export class PageDto<T> {
  readonly data: T | T[];

  @ApiProperty({ type: () => PageMetaDto })
  readonly query?: PageMetaDto;

  @ApiProperty({ type: () => ResponseMetaDto })
  readonly meta: ResponseMetaDto;

  constructor(
    message?: string,
    statusCode?: HttpStatus,
    data?: T,
    meta?: PageMetaDto,
  ) {
    this.data = data;
    this.query = meta;
    this.meta = new ResponseMetaDto(statusCode, message);
  }
}
