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
import { AuthService } from '../auth/auth.service';
import { GroupShoppingList } from 'src/entities/GroupShoppingList';
import { IndividualShoppingList } from 'src/entities/IndividualShoppingList';
import { UserService } from '../user/user.service';
import { GroupShoppingListDto } from './dto/request/groupShoppingList';
import { Group } from 'src/entities/Group';
import { Ingredient } from 'src/entities/Ingredient';
import { IngredientService } from '../ingredient/ingredient.service';

@Injectable({})
export class ShoppingListService {
  constructor(
    private _userService: UserService,
    private _ingredientService: IngredientService,
  ) {}

  // COMMON SERVICES
  async findGroupShoppingList(date: string, groupId: string) {
    try {
      return await AppDataSource.getRepository(GroupShoppingList).findOne({
        relations: {
          group: true,
          shoppingList: true,
        },
        where: {
          date,
          group: {
            id: groupId,
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }
  async findIndividualShoppingList(date: string, userId: string) {
    try {
      return await AppDataSource.getRepository(IndividualShoppingList).findOne({
        relations: {
          user: true,
          shoppingList: true,
        },
        where: {
          date,
          user: {
            id: userId,
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }
  async findShoppingList(id: string) {
    try {
      return await AppDataSource.getRepository(ShoppingList).findOne({
        where: { id },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }
  async insertGroup(date: string, shoppingList: ShoppingList, group: Group) {
    try {
      return await AppDataSource.createQueryBuilder()
        .insert()
        .into(GroupShoppingList)
        .values([
          {
            date,
            shoppingList,
            group,
          },
        ])
        .execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('');
    }
  }
  async insertIndividual(date: string, shoppingList: ShoppingList, user: User) {
    console.log(user);
    console.log(shoppingList);
    try {
      return await AppDataSource.createQueryBuilder()
        .insert()
        .into(IndividualShoppingList)
        .values([
          {
            date,
            shoppingList,
            user,
          },
        ])
        .execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('');
    }
  }
  async insertShoppingList(shoppingListDto: ShoppingListDto) {
    try {
      return await AppDataSource.createQueryBuilder()
        .insert()
        .into(ShoppingList)
        .values([shoppingListDto])
        .execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('');
    }
  }
  async insertIngredientToList(
    shoppingList: ShoppingList,
    ingredient: Ingredient,
    addIngredientDto: AddIngredientDto,
  ) {
    try {
      return await AppDataSource.createQueryBuilder()
        .insert()
        .into(IngredientToShoppingList)
        .values([
          {
            ...addIngredientDto,
            shoppingList,
            ingredient,
          },
        ])
        .execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('');
    }
  }

  // CONTROLLER'S SERVICES

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

  // done
  public async getAllShoppingList(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ShoppingList[]>> {
    const queryBuilder = AppDataSource.createQueryBuilder();

    queryBuilder
      .select('shoppingList')
      .from(ShoppingList, 'shoppingList')
      .orderBy('shoppingList.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ total: itemCount, pageOptionsDto });

    return new PageDto('OK', HttpStatus.OK, entities, pageMetaDto);
  }

  // done
  public async getShoppingListByDate(
    date: string,
    jwtUser: JwtUser,
  ): Promise<PageDto<IngredientToShoppingList[]>> {
    const { sub } = jwtUser;
    const user = await this._userService.findByAccountId(sub.toString());

    const individualList = await this.findIndividualShoppingList(date, user.id);

    if (!individualList) {
      // create shopping list if it's doesn't exist
      const newListId = await this.insertShoppingList({
        date,
        status: ShoppingListStatus.PENDING,
      });

      const newList = await this.findShoppingList(newListId.raw.insertId);

      await this.insertIndividual(date, newList, user);
    }

    const newIndividualList = await this.findIndividualShoppingList(
      date,
      user.id,
    );

    try {
      const result = await AppDataSource.createQueryBuilder(
        IngredientToShoppingList,
        'ingredient_to_shopping_list',
      )
        .leftJoinAndSelect(
          'ingredient_to_shopping_list.ingredient',
          'ingredient',
        )
        .where('shoppingListId = :listId', {
          listId: newIndividualList.shoppingList.id,
        })
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
      const { sub } = jwtUser;
      const user = await this._userService.findByAccountId(sub.toString());

      const individualShoppingList = await this.findIndividualShoppingList(
        addIngredientDto.date,
        user.id,
      );

      const ingredient = await this._ingredientService.findOne(
        addIngredientDto.ingredientId,
      );

      if (!individualShoppingList) {
        const newList = await this.insertShoppingList({
          status: ShoppingListStatus.PENDING,
        });

        await this.insertIndividual(addIngredientDto.date, newList.raw, user);

        await this.insertIngredientToList(
          newList.raw,
          ingredient,
          addIngredientDto,
        );
      } else {
        await this.insertIngredientToList(
          individualShoppingList.shoppingList,
          ingredient,
          addIngredientDto,
        );
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
    const { sub } = jwtUser;

    const user = await this._userService.findByAccountId(sub.toString());
    const list = await this.findIndividualShoppingList(
      removeIngredientDto.date,
      user.id,
    );

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

  // done
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

  // done
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

  // done
  public async assignMarketer(
    jwtUser: JwtUser,
    assignMarketerDto: AssignMarketerDto,
  ) {
    try {
      const { sub } = jwtUser;

      const user = await this._userService.findByAccountId(sub.toString());

      await AppDataSource.createQueryBuilder()
        .update(GroupShoppingList)
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

  // done
  public async unassignMarketer(assignMarketerDto: AssignMarketerDto) {
    try {
      await AppDataSource.createQueryBuilder()
        .update(GroupShoppingList)
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

  // done
  public async getShoppingListDetail(assignMarketerDto: AssignMarketerDto) {
    try {
      const result = await AppDataSource.createQueryBuilder(
        GroupShoppingList,
        'group_shopping_list',
      )
        .leftJoinAndSelect('group_shopping_list.marketer', 'marketer')
        .where('date = :date AND group_shopping_list.groupId = :groupId', {
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
