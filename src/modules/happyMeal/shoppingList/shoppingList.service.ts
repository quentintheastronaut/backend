import { AssignMarketerDto } from './dto/request/assignMarketer.dto';
import { AddGroupIngredientDto } from './dto/request/addGroupIngredient';
import { CheckDto } from './dto/request/check.dto';
import { UpdateIngredientToShoppingListDto } from './dto/request/updateIngredientToShoppingList.dto';
import { RemoveIngredientDto } from './dto/request/removeIngredient.dto';
import { AddIngredientDto } from './dto/request/addIngredient.dto';
import { JwtUser } from './../auth/dto/parsedToken.dto';
import { ShoppingListDto } from './dto/request/shoppingList.dto';
import { AppDataSource } from './../../../data-source';
import { PageOptionsDto } from './../../../dtos/pageOption.dto';
import {
  Injectable,
  InternalServerErrorException,
  HttpStatus,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { PageDto } from 'src/dtos/page.dto';
import { PageMetaDto } from 'src/dtos/pageMeta.dto';
import { ShoppingList } from 'src/entities/ShoppingList';
import { IngredientToShoppingList } from 'src/entities/IngredientToShoppingList';
import { User } from 'src/entities';
import { GroupShoppingList } from 'src/entities/GroupShoppingList';
import { IndividualShoppingList } from 'src/entities/IndividualShoppingList';
import { UserService } from '../user/user.service';
import { Group } from 'src/entities/Group';
import { Ingredient } from 'src/entities/Ingredient';
import { IngredientService } from '../ingredient/ingredient.service';
import { GroupService } from '../group/group.service';

@Injectable({})
export class ShoppingListService {
  constructor(
    @Inject(forwardRef(() => UserService)) private _userService: UserService,
    @Inject(forwardRef(() => IngredientService))
    private _ingredientService: IngredientService,
    @Inject(forwardRef(() => GroupService)) private _groupService: GroupService,
  ) {}

  // COMMON SERVICES
  async findByUserId(userId: string) {
    try {
      return await AppDataSource.getRepository(IndividualShoppingList).find({
        relations: {
          shoppingList: true,
        },
        where: {
          user: {
            id: userId,
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findByGroupId(groupId: string) {
    try {
      return await AppDataSource.getRepository(GroupShoppingList).find({
        relations: {
          shoppingList: true,
        },
        where: {
          group: {
            id: groupId,
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findGroupShoppingList(date: string, group: Group) {
    try {
      return await AppDataSource.getRepository(GroupShoppingList).findOne({
        relations: {
          group: true,
          shoppingList: true,
        },
        where: {
          date,
          group: {
            id: group?.id,
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findGroupShoppingListById(id: string) {
    try {
      return await AppDataSource.getRepository(GroupShoppingList).findOne({
        relations: {
          group: true,
          shoppingList: true,
        },
        where: {
          id,
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findIndividualShoppingListById(id: string) {
    try {
      return await AppDataSource.getRepository(IndividualShoppingList).findOne({
        relations: {
          user: true,
          shoppingList: true,
        },
        where: {
          id,
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findShoppingList(id: string) {
    try {
      return await AppDataSource.getRepository(ShoppingList).findOne({
        where: { id },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
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
      throw new InternalServerErrorException();
    }
  }
  async insertIndividual(shoppingList: ShoppingList, user: User) {
    try {
      return await AppDataSource.createQueryBuilder()
        .insert()
        .into(IndividualShoppingList)
        .values([
          {
            shoppingList,
            user,
          },
        ])
        .execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
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
      throw new InternalServerErrorException();
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
            measurementType: {
              id: addIngredientDto.measurementTypeId,
            },
          },
        ])
        .execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async deleteIngredientToShoppingList(id: string) {
    try {
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(IngredientToShoppingList)
        .where('ingredientToShoppingListId = :id', { id })
        .execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('');
    }
  }

  async updateIngredientToShoppingList(
    id: string,
    addIngredientDto: AddIngredientDto,
  ) {
    try {
      const { measurementTypeId, quantity } = addIngredientDto;
      await AppDataSource.createQueryBuilder()
        .update(IngredientToShoppingList)
        .set({
          quantity,
          measurementType: {
            id: measurementTypeId,
          },
        })
        .where('ingredientToShoppingListId = :id', {
          id,
        })
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
      const { locationId, ...rest } = shoppingListDto;
      await AppDataSource.createQueryBuilder()
        .update(ShoppingList)
        .set({
          ...rest,
          location: {
            id: locationId,
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
    individualShoppingListId: string,
  ): Promise<PageDto<IngredientToShoppingList[]>> {
    const individualList = await this.findIndividualShoppingListById(
      individualShoppingListId,
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
        .leftJoinAndSelect(
          'ingredient_to_shopping_list.measurementType',
          'measurement',
        )
        .where('shoppingListId = :listId', {
          listId: individualList.shoppingList.id,
        })
        .addSelect('SUM(ingredient_to_shopping_list.quantity)', 'quantity')
        .groupBy('ingredient_to_shopping_list.ingredientId')
        .getMany();

      return new PageDto('OK', HttpStatus.OK, result);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  public async getGroupShoppingListByDate(
    groupShoppingListId: string,
  ): Promise<PageDto<IngredientToShoppingList[]>> {
    const groupShoppingList = await this.findGroupShoppingListById(
      groupShoppingListId,
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
        .leftJoinAndSelect(
          'ingredient_to_shopping_list.measurementType',
          'measurement',
        )
        .where('shoppingListId = :listId', {
          listId: groupShoppingList.shoppingList.id,
        })
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
      const list = await this.findGroupShoppingListById(
        addGroupIngredientDto.groupShoppingListId,
      );
      const ingredient = await this._ingredientService.findOne(
        addGroupIngredientDto.ingredientId,
      );
      const filteredIngredient = await AppDataSource.getRepository(
        IngredientToShoppingList,
      ).findOne({
        where: {
          ingredient: {
            id: addGroupIngredientDto.ingredientId,
          },
          shoppingList: {
            id: list.shoppingList.id,
          },
        },
      });

      if (filteredIngredient) {
        await this.updateIngredientToShoppingList(
          filteredIngredient.ingredientToShoppingListId,
          {
            ...addGroupIngredientDto,
            quantity:
              filteredIngredient.quantity + addGroupIngredientDto.quantity,
          },
        );
      } else {
        await this.insertIngredientToList(
          list.shoppingList,
          ingredient,
          addGroupIngredientDto,
        );
      }

      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
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

      const individualShoppingList = await this.findIndividualShoppingListById(
        addIngredientDto.individualShoppingListId,
      );

      const ingredient = await this._ingredientService.findOne(
        addIngredientDto.ingredientId,
      );

      const filteredIngredient = await AppDataSource.getRepository(
        IngredientToShoppingList,
      ).findOne({
        where: {
          ingredient: {
            id: ingredient.id,
          },
          shoppingList: {
            id: individualShoppingList.shoppingList.id,
          },
        },
      });

      if (filteredIngredient) {
        await this.updateIngredientToShoppingList(
          filteredIngredient.ingredientToShoppingListId,
          {
            ...addIngredientDto,
            quantity: filteredIngredient.quantity + addIngredientDto.quantity,
          },
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
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  public async removeIngredient(
    removeIngredientDto: RemoveIngredientDto,
  ): Promise<PageDto<ShoppingList>> {
    try {
      await this.deleteIngredientToShoppingList(
        removeIngredientDto.ingredientToShoppingListId,
      );
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
      const { measurementTypeId, ...payload } =
        updateIngredientToShoppingListDto;
      await AppDataSource.createQueryBuilder()
        .update(IngredientToShoppingList)
        .set({
          measurementType: {
            id: measurementTypeId,
          },
          ...payload,
        })
        .where('ingredientToShoppingListId = :ingredientToShoppingListId', {
          ingredientToShoppingListId:
            updateIngredientToShoppingListDto.ingredientToShoppingListId,
        })
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
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
        .where('id = :id', {
          id: assignMarketerDto.groupShoppingListId,
        })
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
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
        .where('id = :id', {
          id: assignMarketerDto.groupShoppingListId,
        })
        .execute();

      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  // Get shopping list by User
  async getShoppingListByUser(jwtUser: JwtUser) {
    try {
      const { sub } = jwtUser;
      const user = await this._userService.findByAccountId(sub.toString());
      const shoppingLists = await this.findByUserId(user.id);
      return new PageDto('OK', HttpStatus.OK, shoppingLists);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  // Get shopping list by Group
  async getShoppingListByGroup(jwtUser: JwtUser) {
    try {
      const { sub } = jwtUser;
      const user = await this._userService.findByAccountId(sub.toString());
      const group = await this._groupService.findByUser(user);
      const shoppingLists = await this.findByGroupId(group.id);
      return new PageDto('OK', HttpStatus.OK, shoppingLists);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  // done
  public async getShoppingListDetail(groupShoppingListId: string) {
    try {
      const result = await AppDataSource.createQueryBuilder(
        GroupShoppingList,
        'group_shopping_list',
      )
        .leftJoinAndSelect('group_shopping_list.marketer', 'marketer')
        .leftJoinAndSelect('marketer.account', 'account')
        .where('group_shopping_list.id = :groupShoppingListId', {
          groupShoppingListId,
        })
        .getOne();
      return new PageDto('OK', HttpStatus.OK, result);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
