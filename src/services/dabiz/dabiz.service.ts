import { ClassifyImageDto } from 'src/modules/vgg19/classification/dto/request/classifyImage.dto';
import { HttpService } from '@nestjs/axios';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { map, catchError } from 'rxjs';

@Injectable()
export class DabizService {
  constructor(private http: HttpService) {}

  async classify(classifyImageDto: ClassifyImageDto) {
    return this.http
      .post(`${process.env.DABIZ_URL}/classify`, classifyImageDto)
      .pipe(
        map((res) => {
          console.log(res);
          return res.data;
        }),
      )
      .pipe(
        catchError(() => {
          throw new ForbiddenException('API not available');
        }),
      );
  }
}
