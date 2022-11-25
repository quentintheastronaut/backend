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
} from '@nestjs/common';
import { PageDto } from 'src/dtos/page.dto';
import { PageMetaDto } from 'src/dtos/pageMeta.dto';
import { ShoppingList } from 'src/entities/ShoppingList';
import { IngredientToShoppingList } from 'src/entities/IngredientToShoppingList';

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

  public async getMenuByDate(
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
        'ingredient_to_list',
      );
      //   .leftJoinAndSelect(
      //     'ingredient_to_shopping_list.ingredient',
      //     'ingredient',
      //   )
      //   .where('ListId = :listId', { listId: list.id })
      //   .getMany();

      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
