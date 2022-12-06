import { AssignMarketerDto } from './dto/request/assignMarketer.dto';
import { AddGroupIngredientDto } from './dto/request/addGroupIngredient';
import { CheckDto } from './dto/request/check.dto';
import { UpdateIngredientToShoppingListDto } from './dto/request/updateIngredientToShoppingList.dto';
import { RemoveIngredientDto } from './dto/request/removeIngredient.dto';
import { AddIngredientDto } from './dto/request/addIngredient.dto';
import { ShoppingListStatus } from './../../../constants/shoppingListStatus';
import { ShoppingListType } from './../../../constants/shoppingListType';
import { JwtUser } from './../auth/dto/parsedToken.dto';
import { ShoppingListDto } from './dto/request/shoppingList.dto';
import { AppDataSource } from './../../../data-source';
import { PageOptionsDto } from './../../../dtos/pageOption.dto';
import {
  Injectable,
  InternalServerErrorException,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PageDto } from 'src/dtos/page.dto';
import { PageMetaDto } from 'src/dtos/pageMeta.dto';
import { ShoppingList } from 'src/entities/ShoppingList';
import { IngredientToShoppingList } from 'src/entities/IngredientToShoppingList';
import { User } from 'src/entities';

@Injectable({})
export class ShoppingListService {
  public async updateShoppingList(
    id: number,
    shoppingListDto: ShoppingListDto,
  ): Promise<PageDto<ShoppingList>> {
    const shoppingList = await AppDataSource.getRepository(
      ShoppingList,
    ).findOne({
      where: {
        id: id.toString(),
      },
    });

    if (!shoppingList) {
      throw new NotFoundException('Not found');
    }
    try {
      await AppDataSource.createQueryBuilder()
        .update(ShoppingList)
        .set(shoppingListDto)
        .where('id = :id', { id })
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async createShoppingList(
    shoppingListDto: ShoppingListDto,
  ): Promise<PageDto<ShoppingList>> {
    try {
      await AppDataSource.createQueryBuilder()
        .insert()
        .into(ShoppingList)
        .values([shoppingListDto])
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async deleteShoppingList(id: number): Promise<PageDto<ShoppingList>> {
    const shoppingList = await AppDataSource.getRepository(
      ShoppingList,
    ).findOne({
      where: {
        id: id.toString(),
      },
    });

    if (!shoppingList) {
      throw new NotFoundException('Not found');
    }
    try {
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(ShoppingList)
        .where('id = :id', { id })
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async getAllShoppingList(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ShoppingList[]>> {
    const queryBuilder = AppDataSource.createQueryBuilder();

    queryBuilder
      .select('shoppingList')
      .from(ShoppingList, 'shoppingList')
      .where('shoppingList.name like :name', {
        name: `%${pageOptionsDto.search}%`,
      })
      .orderBy('shoppingList.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ total: itemCount, pageOptionsDto });

    return new PageDto('OK', HttpStatus.OK, entities, pageMetaDto);
  }

  public async getShoppingListByDate(
    date: string,
    jwtUser: JwtUser,
  ): Promise<PageDto<IngredientToShoppingList[]>> {
    let list = await AppDataSource.getRepository(ShoppingList).findOne({
      where: {
        date,
        userId: jwtUser.sub.toString(),
      },
    });

    if (!list) {
      await AppDataSource.createQueryBuilder()
        .insert()
        .into(ShoppingList)
        .values([
          {
            date,
            userId: jwtUser.sub.toString(),
            type: ShoppingListType.INDIVIDUAL,
            status: ShoppingListStatus.PENDING,
          },
        ])
        .execute();
    }

    list = await AppDataSource.getRepository(ShoppingList).findOne({
      where: {
        date,
        userId: jwtUser.sub.toString(),
      },
    });

    try {
      const result = await AppDataSource.createQueryBuilder(
        IngredientToShoppingList,
        'ingredient_to_shopping_list',
      )
        .leftJoinAndSelect(
          'ingredient_to_shopping_list.ingredient',
          'ingredient',
        )
        .where('shoppingListId = :listId', { listId: list.id })
        .getMany();

      return new PageDto('OK', HttpStatus.OK, result);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  public async getGroupShoppingListByDate(
    date: string,
    groupId: string,
  ): Promise<PageDto<IngredientToShoppingList[]>> {
    let list = await AppDataSource.getRepository(ShoppingList).findOne({
      where: {
        date,
        groupId,
      },
    });

    if (!list) {
      await AppDataSource.createQueryBuilder()
        .insert()
        .into(ShoppingList)
        .values([
          {
            date,
            groupId,
            type: ShoppingListType.GROUP,
            status: ShoppingListStatus.PENDING,
          },
        ])
        .execute();
    }

    list = await AppDataSource.getRepository(ShoppingList).findOne({
      where: {
        date,
        groupId,
      },
    });

    try {
      const result = await AppDataSource.createQueryBuilder(
        IngredientToShoppingList,
        'ingredient_to_shopping_list',
      )
        .leftJoinAndSelect(
          'ingredient_to_shopping_list.ingredient',
          'ingredient',
        )
        .where('shoppingListId = :listId', { listId: list.id })
        .getMany();

      return new PageDto('OK', HttpStatus.OK, result);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  public async addGroupIngredient(
    addGroupIngredientDto: AddGroupIngredientDto,
  ): Promise<PageDto<ShoppingList>> {
    try {
      const list = await AppDataSource.getRepository(ShoppingList).findOne({
        where: {
          date: addGroupIngredientDto.date,
          groupId: addGroupIngredientDto.groupId,
        },
      });

      if (!list) {
        const newMenuId = await AppDataSource.createQueryBuilder()
          .insert()
          .into(ShoppingList)
          .values({
            date: addGroupIngredientDto.date,
            groupId: addGroupIngredientDto.groupId,
            status: ShoppingListStatus.PENDING,
          })
          .execute();

        await AppDataSource.createQueryBuilder()
          .insert()
          .into(IngredientToShoppingList)
          .values({
            shoppingListId: newMenuId.identifiers[0].id,
            ...addGroupIngredientDto,
          })
          .execute();
      } else {
        await AppDataSource.createQueryBuilder()
          .insert()
          .into(IngredientToShoppingList)
          .values({
            shoppingListId: list.id,
            ...addGroupIngredientDto,
          })
          .execute();
      }

      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async addIngredient(
    addIngredientDto: AddIngredientDto,
    jwtUser: JwtUser,
  ): Promise<PageDto<ShoppingList>> {
    try {
      const { email } = jwtUser;
      const list = await AppDataSource.getRepository(ShoppingList).findOne({
        where: {
          date: addIngredientDto.date,
          user: {
            email: email,
          },
        },
      });

      const user = await AppDataSource.getRepository(User).findOne({
        where: {
          email,
        },
      });

      if (!list) {
        const newMenuId = await AppDataSource.createQueryBuilder()
          .insert()
          .into(ShoppingList)
          .values({
            date: addIngredientDto.date,
            user: user,
            status: ShoppingListStatus.PENDING,
          })
          .execute();

        await AppDataSource.createQueryBuilder()
          .insert()
          .into(IngredientToShoppingList)
          .values({
            shoppingListId: newMenuId.identifiers[0].id,
            ...addIngredientDto,
          })
          .execute();
      } else {
        await AppDataSource.createQueryBuilder()
          .insert()
          .into(IngredientToShoppingList)
          .values({
            shoppingListId: list.id,
            ...addIngredientDto,
          })
          .execute();
      }
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async removeIngredient(
    removeIngredientDto: RemoveIngredientDto,
    jwtUser: JwtUser,
  ): Promise<PageDto<ShoppingList>> {
    const { email } = jwtUser;
    const list = await AppDataSource.getRepository(ShoppingList).findOne({
      relations: {
        user: true,
      },
      where: {
        date: removeIngredientDto.date,
        user: {
          email: email,
        },
      },
    });

    if (!list) {
      throw new BadRequestException('This shopping list is not existed !');
    }

    try {
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(IngredientToShoppingList)
        .where('ingredientToShoppingListId = :ingredientToShoppingListId', {
          ...removeIngredientDto,
        })
        .execute();

      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async updateIngredient(
    updateIngredientToShoppingListDto: UpdateIngredientToShoppingListDto,
  ) {
    const list = await AppDataSource.getRepository(
      IngredientToShoppingList,
    ).findOne({
      where: {
        ingredientToShoppingListId:
          updateIngredientToShoppingListDto.ingredientToShoppingListId,
      },
    });

    if (!list) {
      throw new NotFoundException('This dish is not existed in any menu !');
    }

    try {
      await AppDataSource.createQueryBuilder()
        .update(IngredientToShoppingList)
        .set(updateIngredientToShoppingListDto)
        .where('ingredientToShoppingListId = :ingredientToShoppingListId', {
          ingredientToShoppingListId:
            updateIngredientToShoppingListDto.ingredientToShoppingListId,
        })
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async check(checkDto: CheckDto) {
    try {
      await AppDataSource.createQueryBuilder()
        .update(IngredientToShoppingList)
        .set({
          checked: true,
        })
        .where('ingredientToShoppingListId = :ingredientToShoppingListId', {
          ingredientToShoppingListId: checkDto.ingredientToShoppingListId,
        })
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async uncheck(checkDto: CheckDto) {
    try {
      await AppDataSource.createQueryBuilder()
        .update(IngredientToShoppingList)
        .set({
          checked: false,
        })
        .where('ingredientToShoppingListId = :ingredientToShoppingListId', {
          ingredientToShoppingListId: checkDto.ingredientToShoppingListId,
        })
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async assignMarketer(
    jwtUser: JwtUser,
    assignMarketerDto: AssignMarketerDto,
  ) {
    try {
      const { email } = jwtUser;

      const user = await AppDataSource.getRepository(User).findOne({
        where: {
          email,
        },
      });

      await AppDataSource.createQueryBuilder()
        .update(ShoppingList)
        .set({
          marketer: {
            id: user.id,
          },
        })
        .where('date = :date AND groupId = :groupId', {
          date: assignMarketerDto.date,
          groupId: assignMarketerDto.groupId,
        })
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async unassignMarketer(assignMarketerDto: AssignMarketerDto) {
    try {
      await AppDataSource.createQueryBuilder()
        .update(ShoppingList)
        .set({
          marketer: null,
        })
        .where('date = :date AND groupId = :groupId', {
          date: assignMarketerDto.date,
          groupId: assignMarketerDto.groupId,
        })
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async getShoppingListDetail(assignMarketerDto: AssignMarketerDto) {
    try {
      const result = await AppDataSource.createQueryBuilder(
        ShoppingList,
        'shopping_list',
      )
        .leftJoinAndSelect('shopping_list.marketer', 'marketer')
        .where('date = :date AND shopping_list.groupId = :groupId', {
          date: assignMarketerDto.date,
          groupId: assignMarketerDto.groupId,
        })
        .getOne();
      return new PageDto('OK', HttpStatus.OK, result);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
