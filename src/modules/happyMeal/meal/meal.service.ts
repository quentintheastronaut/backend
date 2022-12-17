import { PageDto } from 'src/dtos/page.dto';
import { PageOptionsDto, PageMetaDto } from 'src/dtos';
import {
  Injectable,
  NotFoundException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { Meal } from 'src/entities/Meal';

@Injectable({})
export class MealService {
  public async find(id: string) {
    try {
      return await AppDataSource.getRepository(Meal).findOne({
        where: { id },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }

  public async getAllMeal(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Meal[]>> {
    try {
      const queryBuilder = AppDataSource.createQueryBuilder();

      queryBuilder
        .select('meal')
        .from(Meal, 'meal')
        .where('meal.name like :name', {
          name: `%${pageOptionsDto.search}%`,
        })
        .orderBy('meal.name', pageOptionsDto.order)
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.limit);

      const itemCount = await queryBuilder.getCount();
      const { entities } = await queryBuilder.getRawAndEntities();

      const pageMetaDto = new PageMetaDto({ total: itemCount, pageOptionsDto });

      return new PageDto('OK', HttpStatus.OK, entities, pageMetaDto);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
