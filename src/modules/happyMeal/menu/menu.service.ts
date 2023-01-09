import { IndividualMenu } from './../../../entities/IndividualMenu';
import { GroupMenu } from './../../../entities/GroupMenu';
import { UserToGroup } from './../../../entities/UserToGroup';
import { AddGroupDishDto } from './dto/request/addGroupDish';
import { Group } from 'src/entities/Group';
import { Menu } from 'src/entities/Menu';
import { IngredientToShoppingList } from './../../../entities/IngredientToShoppingList';
import { IngredientToDish } from './../../../entities/IngredientToDish';
import { TrackDto } from './dto/request/track.dto';
import { JwtUser } from './../auth/dto/parsedToken.dto';
import { DishToMenu } from './../../../entities/DishToMenu';
import { AppDataSource } from './../../../data-source';
import { PageOptionsDto } from './../../../dtos/pageOption.dto';
import {
  Injectable,
  InternalServerErrorException,
  HttpStatus,
  NotFoundException,
  Inject,
  forwardRef,
  Logger,
} from '@nestjs/common';
import { PageDto } from 'src/dtos/page.dto';
import { PageMetaDto } from 'src/dtos/pageMeta.dto';
import { AddDishDto } from './dto/request/addDish.dto';
import { User } from 'src/entities';
import { RemoveDishDto } from './dto/request/removeDish.dto';
import { UpdateDishToMenuDto } from './dto/request/updateDishToMenu.dto';
import { ShoppingListType } from 'src/constants';
import { UserService } from '../user/user.service';
import { GroupService } from '../group/group.service';
import { DishService } from '../dish/dish.service';
import { ShoppingListService } from '../shoppingList/shoppingList.service';
import { Dish } from 'src/entities/Dish';
import { DateFormat } from 'src/constants/dateFormat';
import * as moment from 'moment';
import { MealType } from 'src/constants/mealType';
import { MeasurementService } from '../measurement/measurement.service';
import { DishType } from 'src/constants/dishType';
import { RecombeeService } from 'src/services/recombee/recombee.service';

@Injectable({})
export class MenuService {
  constructor(
    @Inject(forwardRef(() => UserService)) private _userService: UserService,
    @Inject(forwardRef(() => DishService)) private _dishService: DishService,
    @Inject(forwardRef(() => GroupService)) private _groupService: GroupService,
    @Inject(forwardRef(() => ShoppingListService))
    private _shoppingListService: ShoppingListService,
    @Inject(forwardRef(() => MeasurementService))
    private _measurementService: MeasurementService,
    @Inject(forwardRef(() => RecombeeService))
    private _recombeeService: RecombeeService,
  ) {}

  // COMMON SERVICE
  async find(id: string) {
    try {
      return await AppDataSource.getRepository(Menu).findOne({
        where: { id },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }

  async findGroupMenu(date: string, group: Group) {
    try {
      return await AppDataSource.getRepository(GroupMenu).findOne({
        relations: {
          group: true,
          menu: true,
        },
        where: {
          date,
          group: {
            id: group.id,
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }

  async findIndividualMenu(date: string, user: User) {
    try {
      return await AppDataSource.getRepository(IndividualMenu).findOne({
        relations: {
          user: true,
          menu: true,
        },
        where: {
          date,
          user: {
            id: user.id,
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }

  async findIndividualMenuByMenu(menu: Menu) {
    try {
      return await AppDataSource.getRepository(IndividualMenu).findOne({
        relations: {
          user: true,
          menu: true,
        },
        where: {
          menu: {
            id: menu.id,
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }
  async findGroupMenuByMenu(menu: Menu) {
    try {
      return await AppDataSource.getRepository(GroupMenu).findOne({
        relations: {
          group: true,
          menu: true,
        },
        where: {
          menu: {
            id: menu.id,
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }

  async findMenu(id: string) {
    try {
      return await AppDataSource.getRepository(Menu).findOne({
        where: { id },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }

  async findDishToMenu(id: string) {
    try {
      return await AppDataSource.getRepository(DishToMenu).findOne({
        relations: {
          menu: true,
          dish: true,
          meal: true,
        },
        where: {
          dishToMenuId: id,
        },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }

  async insertGroup(date: string, menu: Menu, group: Group) {
    try {
      return await AppDataSource.createQueryBuilder()
        .insert()
        .into(GroupMenu)
        .values([
          {
            date,
            menu,
            group,
          },
        ])
        .execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('');
    }
  }
  async insertIndividual(date: string, menu: Menu, user: User) {
    try {
      return await AppDataSource.createQueryBuilder()
        .insert()
        .into(IndividualMenu)
        .values([
          {
            date,
            menu,
            user,
          },
        ])
        .execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('');
    }
  }

  async insertMenu(type: ShoppingListType) {
    try {
      return await AppDataSource.createQueryBuilder()
        .insert()
        .into(Menu)
        .values([
          {
            type,
          },
        ])
        .execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('');
    }
  }

  async insertDishToMenu(dish: Dish, menu: Menu, addDishDto: AddDishDto) {
    try {
      const { dishId, mealId, ...rest } = addDishDto;
      return await AppDataSource.createQueryBuilder()
        .insert()
        .into(DishToMenu)
        .values([
          {
            ...rest,
            meal: {
              id: addDishDto.mealId,
            },
            dish,
            menu,
          },
        ])
        .execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('');
    }
  }

  async updateDishToMenu(id: string, addDishDto: AddDishDto) {
    try {
      const { mealId, quantity, type } = addDishDto;
      await AppDataSource.createQueryBuilder()
        .update(DishToMenu)
        .set({
          meal: {
            id: mealId,
          },
          quantity,
          type,
        })
        .where('dishToMenuId = :id', {
          id,
        })
        .execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('');
    }
  }

  async deleteDishToMenu(id: string) {
    try {
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(DishToMenu)
        .where('dishToMenuId = :id', { id })
        .execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('');
    }
  }

  async delete(id: string) {
    try {
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(Menu)
        .where('id = :id', { id })
        .execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('');
    }
  }

  // CONTROLLER SERVICES

  public async deleteMenu(id: number): Promise<PageDto<Menu>> {
    try {
      await this.delete(id.toString());
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async getAllMenues(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Menu[]>> {
    const queryBuilder = AppDataSource.createQueryBuilder();

    queryBuilder
      .select('menu')
      .from(Menu, 'menu')
      .orderBy('menu.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ total: itemCount, pageOptionsDto });

    return new PageDto('OK', HttpStatus.OK, entities, pageMetaDto);
  }

  public async addGroupDish(
    addGroupDishDto: AddGroupDishDto,
  ): Promise<PageDto<Menu>> {
    try {
      const { dishId, groupId, date } = addGroupDishDto;
      const dish = await this._dishService.find(dishId);

      const group = await this._groupService.find(groupId);

      const groupMenu = await this.findGroupMenu(date, group);

      if (!groupMenu) {
        const newMenuId = await this.insertMenu(ShoppingListType.GROUP);

        const newMenu = await this.find(newMenuId.raw.insertId);

        await this.insertGroup(date, newMenu, group);

        await this.insertDishToMenu(dish, newMenu, addGroupDishDto);
      } else {
        const filteredDish = await AppDataSource.getRepository(
          DishToMenu,
        ).findOne({
          where: {
            dish: {
              id: dish.id,
            },
            meal: {
              id: addGroupDishDto.mealId,
            },
            menu: {
              id: groupMenu.menu.id,
            },
          },
        });

        if (filteredDish) {
          await this.updateDishToMenu(filteredDish.dishToMenuId, {
            ...addGroupDishDto,
            quantity: filteredDish.quantity + addGroupDishDto.quantity,
          });
        } else {
          await this.insertDishToMenu(dish, groupMenu.menu, addGroupDishDto);
        }
      }

      await this.addIngredientToGroupList(addGroupDishDto, group);

      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  public async recommendByRecombee(jwtUser: JwtUser, date: string) {
    try {
      const { sub } = jwtUser;
      const user = await this._userService.findByAccountId(sub.toString());

      console.log(user);

      const { data } = await this._recombeeService.recommend({
        userId: user.id,
        count: 4,
      });

      const { recomms } = data;

      console.log(recomms);

      await Promise.all([
        await this.addDish(
          {
            date,
            dishType: DishType.COOKING,
            dishId: recomms[0].id,
            type: ShoppingListType.INDIVIDUAL,
            mealId: MealType.BREAKFAST,
            quantity: 1,
            note: '',
          },
          jwtUser,
        ),
        await this.addDish(
          {
            date,
            dishType: DishType.COOKING,
            dishId: recomms[1].id,
            type: ShoppingListType.INDIVIDUAL,
            mealId: MealType.LUNCH,
            quantity: 1,
            note: '',
          },
          jwtUser,
        ),
        await this.addDish(
          {
            date,
            dishType: DishType.COOKING,
            dishId: recomms[2].id,
            type: ShoppingListType.INDIVIDUAL,
            mealId: MealType.DINNER,
            quantity: 1,
            note: '',
          },
          jwtUser,
        ),
        await this.addDish(
          {
            date,
            dishType: DishType.COOKING,
            dishId: recomms[3].id,
            type: ShoppingListType.INDIVIDUAL,
            mealId: MealType.SNACKS,
            quantity: 1,
            note: '',
          },
          jwtUser,
        ),
      ]);

      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  public async recommend(jwtUser: JwtUser, date: string) {
    try {
      const { sub } = jwtUser;
      const user = await this._userService.findByAccountId(sub.toString());

      const dateMoment = moment(date, DateFormat.FULL_DATE);
      const breakfast = [];
      const lunch = [];
      const dinner = [];
      const snack = [];

      for (let i = 1; i <= 3; i++) {
        const current = dateMoment
          .clone()
          .subtract(i, 'day')
          .format(DateFormat.FULL_DATE);
        const user = await this._userService.findByAccountId(sub.toString());

        const individualMenu = await this.findIndividualMenu(current, user);

        if (individualMenu) {
          const dishesToMenu = await AppDataSource.createQueryBuilder(
            DishToMenu,
            'dish_to_menu',
          )
            .leftJoinAndSelect('dish_to_menu.dish', 'dish')
            .leftJoinAndSelect('dish_to_menu.meal', 'meal')
            .where('menuId = :menuId', { menuId: individualMenu.menu.id })
            .getMany();

          dishesToMenu.forEach((dishToMenu) => {
            switch (dishToMenu.meal.id) {
              case MealType.BREAKFAST:
                breakfast.push(dishToMenu.dish.id);
                break;
              case MealType.LUNCH:
                lunch.push(dishToMenu.dish.id);
                break;
              case MealType.DINNER:
                dinner.push(dishToMenu.dish.id);
                break;
              case MealType.SNACKS:
                snack.push(dishToMenu.dish.id);
                break;
              default:
                break;
            }
          });
        }
      }

      const base = await this._userService.getBase(jwtUser);

      const breakfastCalories = (base * 15) / 100;
      const lunchCalories = (base * 50) / 100;
      const dinnerCalories = (base * 20) / 100;
      const snackCalories = (base * 15) / 100;

      const breakfastDishQuery = AppDataSource.createQueryBuilder()
        .select('dish')
        .from(Dish, 'dish')
        .where(
          'calories <= :breakfastCalories AND calories >= :miniumBreakfastCalories',
          {
            breakfastCalories: (breakfastCalories * 110) / 100,
            miniumBreakfastCalories: (breakfastCalories * 70) / 100,
          },
        );

      if (breakfast.length != 0) {
        breakfastDishQuery.andWhere('dish.id NOT IN (:breakfast)', {
          breakfast,
        });
      }

      const lunchDishQuery = AppDataSource.createQueryBuilder()
        .select('dish')
        .from(Dish, 'dish')
        .where(
          'calories <= :lunchCalories AND calories >= :miniumLunchCalories',
          {
            lunchCalories: (lunchCalories * 110) / 100,
            miniumLunchCalories: (lunchCalories * 90) / 100,
          },
        );

      if (lunch.length != 0) {
        lunchDishQuery.andWhere('dish.id NOT IN (:lunch)', { lunch });
      }

      const dinnerDishQuery = AppDataSource.createQueryBuilder()
        .select('dish')
        .from(Dish, 'dish')
        .where(
          'calories <= :dinnerCalories AND calories >= :miniumDinnerCalories',
          {
            dinnerCalories: (dinnerCalories * 110) / 100,
            miniumDinnerCalories: (dinnerCalories * 70) / 100,
          },
        );

      if (dinner.length != 0) {
        dinnerDishQuery.andWhere('dish.id NOT IN (:dinner)', { dinner });
      }

      const snackDishQuery = AppDataSource.createQueryBuilder()
        .select('dish')
        .from(Dish, 'dish')
        .where(
          'calories <= :snackCalories AND calories >= :snackMorningCalories',
          {
            snackCalories: (snackCalories * 110) / 100,
            snackMorningCalories: (snackCalories * 70) / 100,
          },
        );

      if (snack.length != 0) {
        snackDishQuery.andWhere('dish.id NOT IN (:snack)', { snack });
      }

      const breakfastDish = await breakfastDishQuery.orderBy('RAND()').getOne();
      const lunchDish = await lunchDishQuery.orderBy('RAND()').getOne();
      const dinnerDish = await dinnerDishQuery.orderBy('RAND()').getOne();
      const snackDish = await snackDishQuery.orderBy('RAND()').getOne();

      await Promise.all([
        await this.addDish(
          {
            date,
            dishType: DishType.COOKING,
            dishId: breakfastDish.id,
            type: ShoppingListType.INDIVIDUAL,
            mealId: MealType.BREAKFAST,
            quantity: 1,
            note: '',
          },
          jwtUser,
        ),
        await this.addDish(
          {
            date,
            dishType: DishType.COOKING,
            dishId: lunchDish.id,
            type: ShoppingListType.INDIVIDUAL,
            mealId: MealType.LUNCH,
            quantity: 1,
            note: '',
          },
          jwtUser,
        ),
        await this.addDish(
          {
            date,
            dishType: DishType.COOKING,
            dishId: dinnerDish.id,
            type: ShoppingListType.INDIVIDUAL,
            mealId: MealType.DINNER,
            quantity: 1,
            note: '',
          },
          jwtUser,
        ),
        await this.addDish(
          {
            date,
            dishType: DishType.COOKING,
            dishId: snackDish.id,
            type: ShoppingListType.INDIVIDUAL,
            mealId: MealType.SNACKS,
            quantity: 1,
            note: '',
          },
          jwtUser,
        ),
      ]);

      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  public async addDish(
    addDishDto: AddDishDto,
    jwtUser: JwtUser,
  ): Promise<PageDto<Menu>> {
    try {
      const { sub } = jwtUser;
      const { dishId, date } = addDishDto;
      const user = await this._userService.findByAccountId(sub.toString());

      const dish = await this._dishService.find(dishId);

      const individualMenu = await this.findIndividualMenu(date, user);

      if (!individualMenu) {
        const newMenuId = await this.insertMenu(ShoppingListType.INDIVIDUAL);

        const newMenu = await this.find(newMenuId.raw.insertId);

        await this.insertIndividual(date, newMenu, user);

        await this.insertDishToMenu(dish, newMenu, addDishDto);
      } else {
        const filteredDish = await AppDataSource.getRepository(
          DishToMenu,
        ).findOne({
          where: {
            dish: {
              id: dish.id,
            },
            meal: {
              id: addDishDto.mealId,
            },
            menu: {
              id: individualMenu.menu.id,
            },
          },
        });

        if (filteredDish) {
          await this.updateDishToMenu(filteredDish.dishToMenuId, {
            ...addDishDto,
            quantity: filteredDish.quantity + addDishDto.quantity,
          });
        } else {
          await this.insertDishToMenu(dish, individualMenu.menu, addDishDto);
        }
      }

      await this.addIngredientToIndividualList(addDishDto, jwtUser);

      await this._recombeeService.addPlanAddition({
        userId: user.id,
        itemId: dish.id,
        cascadeCreate: true,
      });

      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async removeDish(
    removeDishDto: RemoveDishDto,
    jwtUser = null,
  ): Promise<PageDto<Menu>> {
    try {
      const dishToMenu = await this.findDishToMenu(removeDishDto.dishToMenuId);
      const { menu } = dishToMenu;

      if (menu.type === ShoppingListType.GROUP) {
        await this.removeGroupIngredient(removeDishDto);
      } else {
        await this.removeIngredient(removeDishDto, jwtUser);
        const { sub } = jwtUser;
        const user = await this._userService.findByAccountId(sub.toString());

        await this._recombeeService.deletePlanAddition({
          userId: user.id,
          itemId: dishToMenu.dish.id,
          cascadeCreate: true,
        });
      }

      await this.deleteDishToMenu(removeDishDto.dishToMenuId);

      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      Logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  public async countMember(jwtUser: JwtUser) {
    const { sub } = jwtUser;

    const user = await this._userService.findByAccountId(sub.toString());

    const group = await this._groupService.findByUser(user);

    return await AppDataSource.createQueryBuilder(UserToGroup, 'user_to_group')
      .select()
      .where('groupId = :groupId', { groupId: group.id })
      .getCount();
  }

  public async getGroupMenuByDate(
    date: string,
    groupId: string,
  ): Promise<PageDto<DishToMenu[]>> {
    try {
      const group = await this._groupService.find(groupId);

      if (!group) {
        throw new NotFoundException('This group is not existed !');
      }

      const groupMenu = await this.findGroupMenu(date, group);

      if (!groupMenu) {
        const newMenuId = await this.insertMenu(ShoppingListType.GROUP);

        const newMenu = await this.find(newMenuId.raw.insertId);

        await this.insertGroup(date, newMenu, group);
      }

      const newGroupMenu = await this.findGroupMenu(date, group);

      const result = await AppDataSource.createQueryBuilder(
        DishToMenu,
        'dish_to_menu',
      )
        .leftJoinAndSelect('dish_to_menu.dish', 'dish')
        .leftJoinAndSelect('dish_to_menu.meal', 'meal')
        .where('menuId = :menuId', { menuId: newGroupMenu.menu.id })
        .getMany();

      return new PageDto('OK', HttpStatus.OK, result);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  public async getMenuByDate(
    date: string,
    jwtUser: JwtUser,
  ): Promise<PageDto<DishToMenu[]>> {
    const { sub } = jwtUser;
    const user = await this._userService.findByAccountId(sub.toString());

    const individualMenu = await this.findIndividualMenu(date, user);

    if (!individualMenu) {
      const newMenuId = await this.insertMenu(ShoppingListType.INDIVIDUAL);

      const newMenu = await this.findMenu(newMenuId.raw.insertId);

      await this.insertIndividual(date, newMenu, user);
    }

    const newIndividualMenu = await this.findIndividualMenu(date, user);
    try {
      const result = await AppDataSource.createQueryBuilder(
        DishToMenu,
        'dish_to_menu',
      )
        .leftJoinAndSelect('dish_to_menu.dish', 'dish')
        .leftJoinAndSelect('dish_to_menu.meal', 'meal')
        .where('menuId = :menuId', { menuId: newIndividualMenu.menu.id })
        .getMany();

      return new PageDto('OK', HttpStatus.OK, result);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  public async updateMenuDetail(
    updateDishDto: UpdateDishToMenuDto,
  ): Promise<PageDto<Menu>> {
    const dishToMenu = await this.findDishToMenu(updateDishDto.dishToMenuId);
    const { menu } = dishToMenu;

    if (menu.type === ShoppingListType.GROUP) {
    } else {
    }
    const { mealId, ...rest } = updateDishDto;
    try {
      await AppDataSource.createQueryBuilder()
        .update(DishToMenu)
        .set({
          ...rest,
          meal: {
            id: updateDishDto.mealId,
          },
        })
        .where('dishToMenuId = :dishToMenuId', {
          dishToMenuId: updateDishDto.dishToMenuId,
        })
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  public async track(trackDto: TrackDto, jwtUser: JwtUser) {
    try {
      await AppDataSource.createQueryBuilder()
        .update(DishToMenu)
        .set({
          tracked: true,
        })
        .where('dishToMenuId = :dishToMenuId', {
          dishToMenuId: trackDto.dishToMenuId,
        })
        .execute();

      if (jwtUser) {
        const dishToMenu = await this.findDishToMenu(trackDto.dishToMenuId);
        const { sub } = jwtUser;
        const user = await this._userService.findByAccountId(sub.toString());
        await this._recombeeService.addTrack({
          userId: user.id,
          itemId: dishToMenu.dish.id,
          cascadeCreate: true,
        });
      }

      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async untrack(trackDto: TrackDto, jwtUser: JwtUser) {
    try {
      await AppDataSource.createQueryBuilder()
        .update(DishToMenu)
        .set({
          tracked: false,
        })
        .where('dishToMenuId = :dishToMenuId', {
          dishToMenuId: trackDto.dishToMenuId,
        })
        .execute();

      if (jwtUser) {
        const { sub } = jwtUser;
        const dishToMenu = await this.findDishToMenu(trackDto.dishToMenuId);
        const user = await this._userService.findByAccountId(sub.toString());
        await this._recombeeService.deleteTrack({
          userId: user.id,
          itemId: dishToMenu.dish.id,
          cascadeCreate: true,
        });
      }

      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async addIngredientToGroupList(
    addGroupDishDto: AddGroupDishDto,
    group: Group,
  ) {
    try {
      const { entities } = await AppDataSource.createQueryBuilder(
        IngredientToDish,
        'ingredient_to_dish',
      )
        .leftJoinAndSelect('ingredient_to_dish.ingredient', 'ingredient')
        .leftJoinAndSelect('ingredient_to_dish.measurementType', 'measurement')
        .where('dishId = :dishId', {
          dishId: addGroupDishDto.dishId,
        })
        .getRawAndEntities();

      const ingredientToList = entities.map((ingredient) => ({
        ingredientId: ingredient.ingredient.id,
        quantity: addGroupDishDto.quantity * ingredient.quantity,
        measurementType: ingredient.measurementType,
      }));

      for (const ingredient of ingredientToList) {
        await this._shoppingListService.addGroupIngredient({
          locationId: null,
          groupId: group.id,
          ingredientId: ingredient.ingredientId,
          quantity: ingredient.quantity,
          measurementTypeId: ingredient.measurementType.id,
          date: addGroupDishDto.date,
          note: '',
        });
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  public async addIngredientToIndividualList(
    addDishDto: AddDishDto,
    jwtUser: JwtUser,
  ) {
    try {
      const { entities } = await AppDataSource.createQueryBuilder(
        IngredientToDish,
        'ingredient_to_dish',
      )
        .leftJoinAndSelect('ingredient_to_dish.ingredient', 'ingredient')
        .leftJoinAndSelect('ingredient_to_dish.measurementType', 'measurement')
        .where('dishId = :dishId', {
          dishId: addDishDto.dishId,
        })
        .getRawAndEntities();

      const ingredientToList = entities.map((ingredient) => ({
        ingredientId: ingredient.ingredient.id,
        quantity: addDishDto.quantity * ingredient.quantity,
        measurementTypeId: ingredient.measurementType.id,
      }));

      for (const ingredient of ingredientToList) {
        await this._shoppingListService.addIngredient(
          {
            locationId: null,
            ingredientId: ingredient.ingredientId,
            quantity: ingredient.quantity,
            measurementTypeId: ingredient.measurementTypeId,
            date: addDishDto.date,
            note: '',
          },
          jwtUser,
        );
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  public async removeIngredient(
    removeDishDto: RemoveDishDto,
    jwtUser: JwtUser,
  ) {
    const { sub } = jwtUser;
    const { dishToMenuId } = removeDishDto;

    const dishToMenu = await this.findDishToMenu(dishToMenuId);
    const menu = await this.find(dishToMenu.menu.id);
    const individualMenu = await this.findIndividualMenuByMenu(menu);

    const user = await this._userService.findByAccountId(sub.toString());

    const individualList =
      await this._shoppingListService.findIndividualShoppingList(
        individualMenu.date,
        user.id,
      );

    const dish = await this._dishService.find(dishToMenu.dish.id);

    const ingredients = await AppDataSource.getRepository(
      IngredientToDish,
    ).find({
      relations: {
        dish: true,
        ingredient: true,
        measurementType: true,
      },
      where: {
        dish: {
          id: dish.id,
        },
      },
    });

    const values = ingredients.map((ingredient) => ({
      ...ingredient,
      ingredientId: ingredient.ingredient.id,
      shoppingListId: individualList.shoppingList.id,
    }));

    try {
      for (const value of values) {
        const ingredientToShoppingList = await AppDataSource.getRepository(
          IngredientToShoppingList,
        ).findOne({
          where: {
            ingredient: {
              id: value.ingredientId,
            },
            shoppingList: {
              id: value.shoppingListId,
            },
          },
        });

        if (ingredientToShoppingList) {
          if (
            ingredientToShoppingList.quantity <=
            dishToMenu.quantity * (value?.quantity || 1)
          ) {
            // Case 1:
            await AppDataSource.createQueryBuilder()
              .delete()
              .from(IngredientToShoppingList)
              .where(
                'ingredientId = :ingredientId and shoppingListId = :shoppingListId',
                {
                  ...value,
                },
              )
              .execute();
          } else {
            // Case 2:
            await AppDataSource.createQueryBuilder()
              .update(IngredientToShoppingList)
              .set({
                quantity:
                  ingredientToShoppingList.quantity -
                  dishToMenu.quantity * (value?.quantity || 1),
              })
              .where('ingredientToShoppingListId = :id', {
                id: ingredientToShoppingList.ingredientToShoppingListId,
              })
              .execute();
          }
        }
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  public async removeGroupIngredient(removeDishDto: RemoveDishDto) {
    const { dishToMenuId } = removeDishDto;

    const dishToMenu = await this.findDishToMenu(dishToMenuId);
    const menu = await this.find(dishToMenu.menu.id);
    const groupMenu = await this.findGroupMenuByMenu(menu);

    const group = await this._groupService.find(groupMenu.group.id);

    const individualList =
      await this._shoppingListService.findGroupShoppingList(
        groupMenu.date,
        group,
      );

    const dish = await this._dishService.find(dishToMenu.dish.id);

    const ingredients = await AppDataSource.getRepository(
      IngredientToDish,
    ).find({
      relations: {
        dish: true,
        ingredient: true,
        measurementType: true,
      },
      where: {
        dish: {
          id: dish.id,
        },
      },
    });

    const values = ingredients.map((ingredient) => ({
      ...ingredient,
      ingredientId: ingredient.ingredient.id,
      shoppingListId: individualList.shoppingList.id,
    }));

    try {
      for (const value of values) {
        const ingredientToShoppingList = await AppDataSource.getRepository(
          IngredientToShoppingList,
        ).findOne({
          where: {
            ingredient: {
              id: value.ingredientId,
            },
            shoppingList: {
              id: value.shoppingListId,
            },
          },
        });

        if (ingredientToShoppingList) {
          if (
            ingredientToShoppingList.quantity <=
            dishToMenu.quantity * (value?.quantity || 1)
          ) {
            // Case 1:
            await AppDataSource.createQueryBuilder()
              .delete()
              .from(IngredientToShoppingList)
              .where(
                'ingredientId = :ingredientId and shoppingListId = :shoppingListId',
                {
                  ...value,
                },
              )
              .execute();
          } else {
            // Case 2:
            await AppDataSource.createQueryBuilder()
              .update(IngredientToShoppingList)
              .set({
                quantity:
                  ingredientToShoppingList.quantity -
                  dishToMenu.quantity * (value?.quantity || 1),
              })
              .where('ingredientToShoppingListId = :id', {
                id: ingredientToShoppingList.ingredientToShoppingListId,
              })
              .execute();
          }
        }
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
