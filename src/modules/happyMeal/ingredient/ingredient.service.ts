import { PageDto } from 'src/dtos/page.dto';
import { Ingredient } from './../../../entities/Ingredient';
import { AppDataSource } from './../../../data-source';
import { IngredientDto } from './dto/request/ingredient.dto';
import {
  Injectable,
  NotFoundException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { PageMetaDto, PageOptionsDto } from 'src/dtos';

@Injectable({})
export class IngredientService {
  public async createIngredient(
    ingredientDto: IngredientDto,
  ): Promise<PageDto<Ingredient>> {
    try {
      await AppDataSource.createQueryBuilder()
        .insert()
        .into(Ingredient)
        .values([ingredientDto])
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async updateIngredient(
    id: number,
    ingredientDto: IngredientDto,
  ): Promise<PageDto<Ingredient>> {
    const ingredient = await AppDataSource.getRepository(Ingredient).findOne({
      where: {
        id: id.toString(),
      },
    });

    if (!ingredient) {
      throw new NotFoundException('Not found');
    }

    try {
      await AppDataSource.createQueryBuilder()
        .update(Ingredient)
        .set(ingredientDto)
        .where('id = :id', { id })
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async deleteIngredient(id: number): Promise<PageDto<Ingredient>> {
    const ingredient = await AppDataSource.getRepository(Ingredient).findOne({
      where: {
        id: id.toString(),
      },
    });

    if (!ingredient) {
      throw new NotFoundException('Not found');
    }
    try {
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(Ingredient)
        .where('id = :id', { id })
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async getAllIngredients(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Ingredient[]>> {
    const queryBuilder = AppDataSource.createQueryBuilder();

    queryBuilder
      .select('ingredient')
      .from(Ingredient, 'ingredient')
      .where('ingredient.name like :name', {
        name: `%${pageOptionsDto.search}%`,
      })
      .orderBy('ingredient.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ total: itemCount, pageOptionsDto });

    return new PageDto('OK', HttpStatus.OK, entities, pageMetaDto);
  }
}
