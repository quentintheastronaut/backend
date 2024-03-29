import { AssignMarketerDto } from './dto/request/assignMarketer.dto';
import { AddGroupIngredientDto } from './dto/request/addGroupIngredient';
import { CheckDto } from './dto/request/check.dto';
import { UpdateIngredientToShoppingListDto } from './dto/request/updateIngredientToShoppingList.dto';
import { RemoveIngredientDto } from './dto/request/removeIngredient.dto';
import { AddIngredientDto } from './dto/request/addIngredient.dto';
import { ShoppingListStatus } from './../../../constants/shoppingListStatus';
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
import { ShoppingListType } from 'src/constants';
import * as moment from 'moment';
import { DateFormat } from 'src/constants/dateFormat';

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
  async insertIndividual(date: string, shoppingList: ShoppingList, user: User) {
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
      if (addIngredientDto.locationId) {
        return await AppDataSource.createQueryBuilder()
          .insert()
          .into(IngredientToShoppingList)
          .values([
            {
              ...addIngredientDto,
              shoppingList,
              ingredient,
              location: {
                id: addIngredientDto.locationId,
              },
              measurementType: {
                id: addIngredientDto.measurementTypeId,
              },
            },
          ])
          .execute();
      }

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
      const { measurementTypeId, locationId, quantity } = addIngredientDto;
      if (locationId) {
        await AppDataSource.createQueryBuilder()
          .update(IngredientToShoppingList)
          .set({
            quantity,
            location: {
              id: locationId,
            },
            measurementType: {
              id: measurementTypeId,
            },
          })
          .where('ingredientToShoppingListId = :id', {
            id,
          })
          .execute();
      } else {
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
      }
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

  public async getShoppingListByRange(
    fromDate: string,
    toDate: string,
    jwtUser: JwtUser,
  ): Promise<PageDto<any>> {
    try {
      const shoppingListIds = [];
      const from = moment(fromDate, DateFormat.FULL_DATE);
      const to = moment(toDate, DateFormat.FULL_DATE);

      const it = from;

      while (it <= to) {
        const shoppingListId = await this.getShoppingListId(
          it.format(DateFormat.FULL_DATE),
          jwtUser,
        );
        it.add(1, 'days');
        shoppingListIds.push(shoppingListId);
      }

      const locations = await AppDataSource.createQueryBuilder(
        IngredientToShoppingList,
        'ingredient_to_shopping_list',
      )
        .leftJoinAndSelect('ingredient_to_shopping_list.location', 'location')
        .where('shoppingListId in (:shoppingListIds)', {
          shoppingListIds,
        })
        .groupBy('ingredient_to_shopping_list.locationId')
        .getMany();

      const filteredLocations = locations.filter(
        (location) => location.location,
      );

      const locationId = filteredLocations.map((location) => {
        return location.location && location.location.id;
      });

      const ingredientCategory = await AppDataSource.createQueryBuilder(
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
        .leftJoinAndSelect(
          'ingredient.ingredientCategory',
          'ingredientCategory',
        )
        .leftJoinAndSelect('ingredient_to_shopping_list.location', 'location')
        .where('shoppingListId in (:shoppingListIds)', {
          shoppingListIds,
        })
        .addSelect('SUM(ingredient_to_shopping_list.quantity)', 'quantity')
        .groupBy('ingredient.ingredientCategory')
        .getMany();

      const filteredIngredientCategory = ingredientCategory.filter(
        (ingredientToShoppingList) =>
          ingredientToShoppingList.ingredient.ingredientCategory,
      );

      const ingredientCategoryId = filteredIngredientCategory.map(
        (ingredientToShoppingList) => {
          return (
            ingredientToShoppingList.ingredient.ingredientCategory &&
            ingredientToShoppingList.ingredient.ingredientCategory.id
          );
        },
      );

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
        .leftJoinAndSelect(
          'ingredient.ingredientCategory',
          'ingredientCategory',
        )
        .leftJoinAndSelect('ingredient_to_shopping_list.location', 'location')
        .where('shoppingListId in (:shoppingListIds)', {
          shoppingListIds,
        })
        .addSelect('SUM(ingredient_to_shopping_list.quantity)', 'quantity')
        .groupBy('ingredient_to_shopping_list.ingredientId')
        .getMany();

      const finalResult = [];

      const locatedIngredients = result.filter((item) => {
        return item.location !== null;
      });
      for (let i = 0; i < locationId.length; i++) {
        const ingredientCategories = [];
        const uncategorizedIngredients = locatedIngredients.filter((item) => {
          return (
            item.location?.id === locationId[i] &&
            item.ingredient.ingredientCategory === null
          );
        });
        for (let j = 0; j < ingredientCategoryId.length; j++) {
          const ingredients = locatedIngredients.filter((item) => {
            return (
              item.location?.id === locationId[i] &&
              item.ingredient.ingredientCategory?.id === ingredientCategoryId[j]
            );
          });
          const item = {
            ...filteredIngredientCategory[j].ingredient.ingredientCategory,
            ingredients: ingredients,
          };
          ingredientCategories.push(item);
        }
        ingredientCategories.push({
          name: 'The Others',
          ingredients: uncategorizedIngredients,
        });

        const locationItem = {
          ...filteredLocations[i].location,
          ingredientCategories: ingredientCategories,
        };
        finalResult.push(locationItem);
      }

      // the others
      const unlocatedIngredients = result.filter((item) => {
        return item.location === null;
      });
      const ingredientCategories = [];
      const uncategorizedIngredients = unlocatedIngredients.filter((item) => {
        return item.ingredient.ingredientCategory === null;
      });
      for (let j = 0; j < ingredientCategoryId.length; j++) {
        const ingredients = unlocatedIngredients.filter((item) => {
          return (
            item.ingredient.ingredientCategory?.id === ingredientCategoryId[j]
          );
        });
        const item = {
          ...filteredIngredientCategory[j].ingredient.ingredientCategory,
          ingredients: ingredients,
        };
        ingredientCategories.push(item);
      }

      ingredientCategories.push({
        name: 'The Others',
        ingredients: uncategorizedIngredients,
      });

      finalResult.push({
        name: 'The Others',
        ingredientCategories: ingredientCategories,
      });

      return new PageDto('OK', HttpStatus.OK, finalResult);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  public async getShoppingListId(date: string, jwtUser: JwtUser) {
    const { sub } = jwtUser;
    const user = await this._userService.findByAccountId(sub.toString());

    const individualList = await this.findIndividualShoppingList(date, user.id);

    if (!individualList) {
      // create shopping list if it's doesn't exist
      const newListId = await this.insertShoppingList({
        type: ShoppingListType.INDIVIDUAL,
        status: ShoppingListStatus.PENDING,
      });

      const newList = await this.findShoppingList(newListId.raw.insertId);

      await this.insertIndividual(date, newList, user);
    }

    const newIndividualList = await this.findIndividualShoppingList(
      date,
      user.id,
    );

    return newIndividualList.shoppingList.id;
  }

  // done
  public async getShoppingListByDate(
    date: string,
    jwtUser: JwtUser,
  ): Promise<any> {
    const { sub } = jwtUser;
    const user = await this._userService.findByAccountId(sub.toString());

    const individualList = await this.findIndividualShoppingList(date, user.id);

    if (!individualList) {
      // create shopping list if it's doesn't exist
      const newListId = await this.insertShoppingList({
        type: ShoppingListType.GROUP,
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
        .leftJoinAndSelect(
          'ingredient_to_shopping_list.measurementType',
          'measurement',
        )
        .leftJoinAndSelect(
          'ingredient.ingredientCategory',
          'ingredientCategory',
        )
        .leftJoinAndSelect('ingredient_to_shopping_list.location', 'location')
        .where('shoppingListId = :listId', {
          listId: newIndividualList.shoppingList.id,
        })
        .addSelect('SUM(ingredient_to_shopping_list.quantity)', 'quantity')
        .groupBy('ingredient_to_shopping_list.ingredientId')
        .getMany();

      return result;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  public async getGroupShoppingListId(date: string, groupId: string) {
    const group = await this._groupService.find(groupId);
    let groupShoppingList = await this.findGroupShoppingList(date, group);

    if (!groupShoppingList) {
      const newListId = await this.insertShoppingList({
        type: ShoppingListType.GROUP,
        status: ShoppingListStatus.PENDING,
      });

      const newList = await this.findShoppingList(newListId.raw.insertId);

      await this.insertGroup(date, newList, group);
    }

    groupShoppingList = await this.findGroupShoppingList(date, group);

    return groupShoppingList.shoppingList.id;
  }

  public async getGroupShoppingListByRange(
    fromDate: string,
    toDate: string,
    groupId: string,
  ): Promise<PageDto<any>> {
    try {
      const shoppingListIds = [];
      const from = moment(fromDate, DateFormat.FULL_DATE);
      const to = moment(toDate, DateFormat.FULL_DATE);

      const it = from;

      while (it <= to) {
        const shoppingListId = await this.getGroupShoppingListId(
          it.format(DateFormat.FULL_DATE),
          groupId,
        );
        it.add(1, 'days');
        shoppingListIds.push(shoppingListId);
      }

      const locations = await AppDataSource.createQueryBuilder(
        IngredientToShoppingList,
        'ingredient_to_shopping_list',
      )
        .leftJoinAndSelect('ingredient_to_shopping_list.location', 'location')
        .where('shoppingListId in (:shoppingListIds)', {
          shoppingListIds,
        })
        .groupBy('ingredient_to_shopping_list.locationId')
        .getMany();

      const filteredLocations = locations.filter(
        (location) => location.location,
      );

      const locationId = filteredLocations.map((location) => {
        return location.location && location.location.id;
      });

      const ingredientCategory = await AppDataSource.createQueryBuilder(
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
        .leftJoinAndSelect(
          'ingredient.ingredientCategory',
          'ingredientCategory',
        )
        .leftJoinAndSelect('ingredient_to_shopping_list.location', 'location')
        .where('shoppingListId in (:shoppingListIds)', {
          shoppingListIds,
        })
        .addSelect('SUM(ingredient_to_shopping_list.quantity)', 'quantity')
        .groupBy('ingredient.ingredientCategory')
        .getMany();

      const filteredIngredientCategory = ingredientCategory.filter(
        (ingredientToShoppingList) =>
          ingredientToShoppingList.ingredient.ingredientCategory,
      );

      const ingredientCategoryId = filteredIngredientCategory.map(
        (ingredientToShoppingList) => {
          return (
            ingredientToShoppingList.ingredient.ingredientCategory &&
            ingredientToShoppingList.ingredient.ingredientCategory.id
          );
        },
      );

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
        .leftJoinAndSelect(
          'ingredient.ingredientCategory',
          'ingredientCategory',
        )
        .leftJoinAndSelect('ingredient_to_shopping_list.location', 'location')
        .where('shoppingListId in (:shoppingListIds)', {
          shoppingListIds,
        })
        .addSelect('SUM(ingredient_to_shopping_list.quantity)', 'quantity')
        .groupBy('ingredient_to_shopping_list.ingredientId')
        .getMany();

      const finalResult = [];

      const locatedIngredients = result.filter((item) => {
        return item.location !== null;
      });
      for (let i = 0; i < locationId.length; i++) {
        const ingredientCategories = [];
        const uncategorizedIngredients = locatedIngredients.filter((item) => {
          return (
            item.location?.id === locationId[i] &&
            item.ingredient.ingredientCategory === null
          );
        });
        for (let j = 0; j < ingredientCategoryId.length; j++) {
          const ingredients = locatedIngredients.filter((item) => {
            return (
              item.location?.id === locationId[i] &&
              item.ingredient.ingredientCategory?.id === ingredientCategoryId[j]
            );
          });
          const item = {
            ...filteredIngredientCategory[j].ingredient.ingredientCategory,
            ingredients: ingredients,
          };
          ingredientCategories.push(item);
        }
        ingredientCategories.push({
          name: 'The Others',
          ingredients: uncategorizedIngredients,
        });

        const locationItem = {
          ...filteredLocations[i].location,
          ingredientCategories: ingredientCategories,
        };
        finalResult.push(locationItem);
      }

      // the others
      const unlocatedIngredients = result.filter((item) => {
        return item.location === null;
      });
      const ingredientCategories = [];
      const uncategorizedIngredients = unlocatedIngredients.filter((item) => {
        return item.ingredient.ingredientCategory === null;
      });
      for (let j = 0; j < ingredientCategoryId.length; j++) {
        const ingredients = unlocatedIngredients.filter((item) => {
          return (
            item.ingredient.ingredientCategory?.id === ingredientCategoryId[j]
          );
        });
        const item = {
          ...filteredIngredientCategory[j].ingredient.ingredientCategory,
          ingredients: ingredients,
        };
        ingredientCategories.push(item);
      }

      ingredientCategories.push({
        name: 'The Others',
        ingredients: uncategorizedIngredients,
      });

      finalResult.push({
        name: 'The Others',
        ingredientCategories: ingredientCategories,
      });

      return new PageDto('OK', HttpStatus.OK, finalResult);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  public async getGroupShoppingListByDate(
    date: string,
    groupId: string,
  ): Promise<PageDto<IngredientToShoppingList[]>> {
    const group = await this._groupService.find(groupId);
    let groupShoppingList = await this.findGroupShoppingList(date, group);

    if (!groupShoppingList) {
      const newListId = await this.insertShoppingList({
        type: ShoppingListType.GROUP,
        status: ShoppingListStatus.PENDING,
      });

      const newList = await this.findShoppingList(newListId.raw.insertId);

      await this.insertGroup(date, newList, group);
    }

    groupShoppingList = await this.findGroupShoppingList(date, group);

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
        .leftJoinAndSelect(
          'ingredient.ingredientCategory',
          'ingredientCategory',
        )
        .leftJoinAndSelect('ingredient_to_shopping_list.location', 'location')
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
      const { date, groupId } = addGroupIngredientDto;

      const group = await this._groupService.find(groupId);

      const list = await this.findGroupShoppingList(date, group);

      const ingredient = await this._ingredientService.findOne(
        addGroupIngredientDto.ingredientId,
      );

      if (!list) {
        const newListId = await this.insertShoppingList({
          type: ShoppingListType.GROUP,
          status: ShoppingListStatus.PENDING,
        });

        const newList = await this.findShoppingList(newListId.raw.insertId);

        await this.insertGroup(date, newList, group);

        await this.insertIngredientToList(
          newList,
          ingredient,
          addGroupIngredientDto,
        );
      } else {
        const filteredIngredient = await AppDataSource.getRepository(
          IngredientToShoppingList,
        ).findOne({
          where: {
            ingredient: {
              id: ingredient.id,
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
      const { date } = addIngredientDto;
      const user = await this._userService.findByAccountId(sub.toString());

      const individualShoppingList = await this.findIndividualShoppingList(
        date,
        user.id,
      );

      const ingredient = await this._ingredientService.findOne(
        addIngredientDto.ingredientId,
      );

      if (!individualShoppingList) {
        const newListId = await this.insertShoppingList({
          status: ShoppingListStatus.PENDING,
        });

        const newList = await this.findShoppingList(newListId.raw.insertId);

        await this.insertIndividual(date, newList, user);

        await this.insertIngredientToList(
          newList,
          ingredient,
          addIngredientDto,
        );
      } else {
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
      const { measurementTypeId, locationId, ...payload } =
        updateIngredientToShoppingListDto;

      if (locationId) {
        await AppDataSource.createQueryBuilder()
          .update(IngredientToShoppingList)
          .set({
            measurementType: {
              id: measurementTypeId,
            },
            location: {
              id: locationId,
            },
            ...payload,
          })
          .where('ingredientToShoppingListId = :ingredientToShoppingListId', {
            ingredientToShoppingListId:
              updateIngredientToShoppingListDto.ingredientToShoppingListId,
          })
          .execute();
      } else {
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
      }

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
        .where('date = :date AND groupId = :groupId', {
          date: assignMarketerDto.date,
          groupId: assignMarketerDto.groupId,
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
        .where('date = :date AND groupId = :groupId', {
          date: assignMarketerDto.date,
          groupId: assignMarketerDto.groupId,
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
  public async getShoppingListDetail(assignMarketerDto: AssignMarketerDto) {
    try {
      const result = await AppDataSource.createQueryBuilder(
        GroupShoppingList,
        'group_shopping_list',
      )
        .leftJoinAndSelect('group_shopping_list.marketer', 'marketer')
        .leftJoinAndSelect('marketer.account', 'account')
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
