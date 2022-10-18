import { DabizDataDto } from './dabizData.dto';
import { DabizResponseMetaDto } from './dabizResponseMeta.dto';

export class DabizResponseDto<T> {
  meta: DabizResponseMetaDto;
  data: T;
}
