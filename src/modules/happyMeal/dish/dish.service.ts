import { DishDto } from './dto/request/dish.dto';
import { AppDataSource } from './../../../data-source';
import { PageOptionsDto } from './../../../dtos/pageOption.dto';
import {
  Injectable,
  InternalServerErrorException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { PageDto } from 'src/dtos/page.dto';
import { PageMetaDto } from 'src/dtos/pageMeta.dto';
import { Dish } from 'src/entities/Dish';

@Injectable({})
export class DishService {
  public async updateDish(
    id: number,
    dishDto: DishDto,
  ): Promise<PageDto<Dish>> {
    const dish = await AppDataSource.getRepository(Dish).findOne({
      where: {
        id: id.toString(),
      },
    });

    if (!dish) {
      throw new NotFoundException('Not found');
    }
    try {
      await AppDataSource.createQueryBuilder()
        .update(Dish)
        .set(dishDto)
        .where('id = :id', { id })
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async createDish(dishDto: DishDto): Promise<PageDto<Dish>> {
    try {
      await AppDataSource.createQueryBuilder()
        .insert()
        .into(Dish)
        .values([dishDto])
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async deleteDish(id: number): Promise<PageDto<Dish>> {
    const dish = await AppDataSource.getRepository(Dish).findOne({
      where: {
        id: id.toString(),
      },
    });

    if (!dish) {
      throw new NotFoundException('Not found');
    }
    try {
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(Dish)
        .where('id = :id', { id })
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async getAllDishes(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Dish[]>> {
    const queryBuilder = AppDataSource.createQueryBuilder();

    queryBuilder
      .select('dish')
      .from(Dish, 'dish')
      .where('dish.name like :name', {
        name: `%${pageOptionsDto.search}%`,
      })
      .orderBy('dish.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ total: itemCount, pageOptionsDto });

    return new PageDto('OK', HttpStatus.OK, entities, pageMetaDto);
  }

  public async getDishDetail(id: string): Promise<PageDto<Dish>> {
    try {
      const dish = await AppDataSource.getRepository(Dish).findOne({
        where: {
          id,
        },
      });
      console.log(dish);
      return new PageDto('OK', HttpStatus.OK, dish);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
