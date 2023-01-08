import { IncompatibleDto } from './dto/request/incompatible.dto';
import { Incompatible } from './../../../entities/Incompatible';
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
  public async findOne(id: string) {
    try {
      return await AppDataSource.getRepository(Ingredient).findOne({
        relations: {
          ingredientCategory: true,
        },
        where: { id },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Ingredient not found');
    }
  }

  public async insertIncompatibleIngredient(
    firstIngredientId: string,
    secondIngredientId: string,
    note: string,
  ) {
    try {
      await AppDataSource.createQueryBuilder()
        .insert()
        .into(Incompatible)
        .values([
          {
            isIncompatibleTo: {
              id: firstIngredientId,
            },
            isIncompatibleBy: {
              id: secondIngredientId,
            },
            note,
          },
          {
            isIncompatibleTo: {
              id: secondIngredientId,
            },
            isIncompatibleBy: {
              id: firstIngredientId,
            },
            note,
          },
        ])
        .execute();
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Ingredient not found');
    }
  }

  public async deleteIncompatibleIngredient(
    firstIngredientId: string,
    secondIngredientId: string,
  ) {
    try {
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(Incompatible)
        .where(
          '(isIncompatibleToId = :firstIngredientId AND isIncompatibleById = :secondIngredientId) OR (isIncompatibleById = :firstIngredientId AND isIncompatibleToId = :secondIngredientId )',
          {
            firstIngredientId,
            secondIngredientId,
          },
        )
        .execute();
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Ingredient not found');
    }
  }

  public async updateIncompatibleIngredient(
    firstIngredientId: string,
    secondIngredientId: string,
    note: string,
  ) {
    try {
      await AppDataSource.createQueryBuilder()
        .update(Incompatible)
        .set({
          note: note,
        })
        .where(
          '(isIncompatibleToId = :firstIngredientId AND isIncompatibleById = :secondIngredientId) OR (isIncompatibleById = :firstIngredientId AND isIncompatibleToId = :secondIngredientId )',
          {
            firstIngredientId,
            secondIngredientId,
          },
        )
        .execute();
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Ingredient not found');
    }
  }

  public async findIncompatibleByIngredientId(ingredientId: string) {
    try {
      return await AppDataSource.getRepository(Incompatible).find({
        relations: {
          isIncompatibleBy: true,
        },
        where: {
          isIncompatibleTo: {
            id: ingredientId,
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }

  public async createIngredient(
    ingredientDto: IngredientDto,
  ): Promise<PageDto<Ingredient>> {
    try {
      const { ingredientCategoryId, ...rest } = ingredientDto;
      await AppDataSource.createQueryBuilder()
        .insert()
        .into(Ingredient)
        .values([
          {
            ...rest,
            ingredientCategory: {
              id: ingredientCategoryId,
            },
          },
        ])
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
      const { ingredientCategoryId, ...rest } = ingredientDto;
      await AppDataSource.createQueryBuilder()
        .update(Ingredient)
        .set({
          ...rest,
          ingredientCategory: {
            id: ingredientCategoryId,
          },
        })
        .where('id = :id', { id })
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
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
      .leftJoinAndSelect('ingredient.ingredientCategory', 'ingredientCategory')
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

  public async getIncompatibleIngredient(ingredientId: string) {
    try {
      const incompatibleIngredients = await this.findIncompatibleByIngredientId(
        ingredientId,
      );
      return new PageDto('OK', HttpStatus.OK, incompatibleIngredients);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async addIncompatibleRelation(incompatibleDto: IncompatibleDto) {
    try {
      this.insertIncompatibleIngredient(
        incompatibleDto.firstIngredient,
        incompatibleDto.secondIngredient,
        incompatibleDto.note,
      );
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async updateIncompatibleRelation(incompatibleDto: IncompatibleDto) {
    try {
      this.updateIncompatibleIngredient(
        incompatibleDto.firstIngredient,
        incompatibleDto.secondIngredient,
        incompatibleDto.note,
      );
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async removeIncompatibleRelation(incompatibleDto: IncompatibleDto) {
    try {
      this.deleteIncompatibleIngredient(
        incompatibleDto.firstIngredient,
        incompatibleDto.secondIngredient,
      );
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
