import { PageDto } from 'src/dtos';
import { Dish } from 'src/entities/Dish';
import { ClassifyImageDto } from 'src/modules/vgg19/classification/dto/request/classifyImage.dto';
import { HttpService } from '@nestjs/axios';
import { ForbiddenException, Injectable, HttpStatus } from '@nestjs/common';
import { map, catchError, firstValueFrom } from 'rxjs';
import { AppDataSource } from 'src/data-source';

@Injectable()
export class DabizService {
  constructor(private http: HttpService) {}

  async classify(classifyImageDto: ClassifyImageDto) {
    const { data } = await firstValueFrom(
      this.http
        .post(`${process.env.DABIZ_URL}/classify`, classifyImageDto)
        .pipe(
          map((res) => {
            return res.data;
          }),
        )
        .pipe(
          catchError((error) => {
            console.log(error);
            throw new ForbiddenException(error);
          }),
        ),
    );

    const result = [];

    for (let i = 0; i < data.length; i += 1) {
      const dish = await AppDataSource.getRepository(Dish).findOne({
        where: {
          slug: data[i].slug,
        },
      });
      result.push(dish);
    }

    return new PageDto('OK', HttpStatus.OK, result);
  }
}
