import { FoodCategoryDto } from './dto/request/foodCategory.dto';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/dtos';
import { AppDataSource } from 'src/data-source';
import {
  Injectable,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { FoodCategory } from 'src/entities/FoodCategory';
@Injectable({})
export class FoodCategoryService {
  // COMMON SERVICE
  public async insert(foodCategoryDto: FoodCategoryDto) {
    try {
      await AppDataSource.createQueryBuilder()
        .insert()
        .into(FoodCategory)
        .values([foodCategoryDto])
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async delete(id: string) {
    try {
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(FoodCategory)
        .where('id = :id', { id })
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async update(id: string, foodCategoryDto: FoodCategoryDto) {
    try {
      await AppDataSource.createQueryBuilder()
        .update(FoodCategory)
        .set(foodCategoryDto)
        .where('id = :id', { id })
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async createFoodCategory(
    foodCategory: FoodCategoryDto,
  ): Promise<PageDto<FoodCategory>> {
    try {
      await this.insert(foodCategory);
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  public async getAllFoodCategories(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<FoodCategory[]>> {
    const queryBuilder = AppDataSource.createQueryBuilder()
      .select('foodCategory')
      .from(FoodCategory, 'foodCategory')
      .where('foodCategory.name like :name', {
        name: `%${pageOptionsDto.search}%`,
      })
      .orderBy('foodCategory.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ total: itemCount, pageOptionsDto });

    return new PageDto('OK', HttpStatus.OK, entities, pageMetaDto);
  }

  public async updateFoodCategory(
    id: string,
    foodCategoryDto: FoodCategoryDto,
  ) {
    try {
      await this.update(id, foodCategoryDto);
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  public async removeFoodCategory(id: string) {
    try {
      await this.delete(id);
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
