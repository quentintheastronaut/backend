import { HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/dtos';
import { IngredientCategory } from 'src/entities/IngredientCategory';
import { IngredientCategoryDto } from './dto/request/ingredientCategory.dto';
@Injectable({})
export class IngredientCategoryService {
  public async insert(ingredientCategoryDto: IngredientCategoryDto) {
    try {
      await AppDataSource.createQueryBuilder()
        .insert()
        .into(IngredientCategory)
        .values([ingredientCategoryDto])
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
        .from(IngredientCategory)
        .where('id = :id', { id })
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async update(
    id: string,
    ingredientCategoryDto: IngredientCategoryDto,
  ) {
    try {
      await AppDataSource.createQueryBuilder()
        .update(IngredientCategory)
        .set(ingredientCategoryDto)
        .where('id = :id', { id })
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // CONTROLLER SERVICE
  public async createIngredientCategory(
    ingredientCategoryDto: IngredientCategoryDto,
  ): Promise<PageDto<IngredientCategory>> {
    try {
      await this.insert(ingredientCategoryDto);
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  public async getAllIngredientCategories(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<IngredientCategory[]>> {
    const queryBuilder = AppDataSource.createQueryBuilder()
      .select('ingredientCategory')
      .from(IngredientCategory, 'ingredientCategory')
      .where('ingredientCategory.name like :name', {
        name: `%${pageOptionsDto.search}%`,
      })
      .orderBy('ingredientCategory.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ total: itemCount, pageOptionsDto });

    return new PageDto('OK', HttpStatus.OK, entities, pageMetaDto);
  }

  public async updateIngredientCategory(
    id: string,
    ingredientCategoryDto: IngredientCategoryDto,
  ) {
    try {
      await this.update(id, ingredientCategoryDto);
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  public async removeIngredientCategory(id: string) {
    try {
      await this.delete(id);
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
