import { IndividualMenu } from './../../../entities/IndividualMenu';
import { GroupMenu } from './../../../entities/GroupMenu';
import { UserToGroup } from './../../../entities/UserToGroup';
import { AddGroupDishDto } from './dto/request/addGroupDish';
import { Group } from 'src/entities/Group';
import { Menu } from 'src/entities/Menu';
import { IngredientToShoppingList } from './../../../entities/IngredientToShoppingList';
import { ShoppingList } from 'src/entities/ShoppingList';
import { IngredientToDish } from './../../../entities/IngredientToDish';
import { TrackDto } from './dto/request/track.dto';
import { JwtUser } from './../auth/dto/parsedToken.dto';
import { DishToMenu } from './../../../entities/DishToMenu';
import { MenuDto } from './dto/request/menu.dto';
import { AppDataSource } from './../../../data-source';
import { PageOptionsDto } from './../../../dtos/pageOption.dto';
import {
  Injectable,
  InternalServerErrorException,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PageDto } from 'src/dtos/page.dto';
import { PageMetaDto } from 'src/dtos/pageMeta.dto';
import { AddDishDto } from './dto/request/addDish.dto';
import { User } from 'src/entities';
import { RemoveDishDto } from './dto/request/removeDish.dto';
import { UpdateDishToMenuDto } from './dto/request/updateDishToMenu.dto';
import { ShoppingListStatus, ShoppingListType } from 'src/constants';
import { UserService } from '../user/user.service';
import { GroupService } from '../group/group.service';
import { DishService } from '../dish/dish.service';
import { ShoppingListService } from '../shoppingList/shoppingList.service';
import { Dish } from 'src/entities/Dish';
import { group } from 'console';

@Injectable({})
export class MenuService {
  constructor(
    @Inject(forwardRef(() => UserService)) private _userService: UserService,
    @Inject(forwardRef(() => DishService)) private _dishService: DishService,
    @Inject(forwardRef(() => GroupService)) private _groupService: GroupService,
    @Inject(forwardRef(() => ShoppingListService))
    private _shoppingListService: ShoppingListService,
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
      return await AppDataSource.createQueryBuilder()
        .insert()
        .into(DishToMenu)
        .values([
          {
            ...addDishDto,
            menu,
            dish,
          },
        ])
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
        await this.insertDishToMenu(dish, groupMenu.menu, addGroupDishDto);
      }

      await this.addIngredientToGroupList(addGroupDishDto, group);

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
        await this.insertDishToMenu(dish, individualMenu.menu, addDishDto);
      }
      await this.addIngredientToIndividualList(addDishDto, jwtUser);

      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async removeDish(
    removeDishDto: RemoveDishDto,
    jwtUser: JwtUser,
  ): Promise<PageDto<Menu>> {
    try {
      const dishToMenu = await this.findDishToMenu(removeDishDto.dishToMenuId);
      const { menu } = dishToMenu;

      if (menu.type === ShoppingListType.GROUP) {
        await this.removeGroupIngredient(removeDishDto);
      } else {
        await this.removeIngredient(removeDishDto, jwtUser);
      }

      await this.deleteDishToMenu(removeDishDto.dishToMenuId);
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
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
    const dish = await AppDataSource.getRepository(DishToMenu).findOne({
      where: {
        dishToMenuId: updateDishDto.dishToMenuId,
      },
    });

    if (!dish) {
      throw new NotFoundException('This dish is not existed in any menu !');
    }

    try {
      await AppDataSource.createQueryBuilder()
        .update(DishToMenu)
        .set(updateDishDto)
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

  public async track(trackDto: TrackDto) {
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
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async untrack(trackDto: TrackDto) {
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
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async addIngredientToGroupList(addDishDto: AddDishDto, group: Group) {
    try {
      const { entities } = await AppDataSource.createQueryBuilder(
        IngredientToDish,
        'ingredient_to_dish',
      )
        .leftJoinAndSelect('ingredient_to_dish.ingredient', 'ingredient')
        .where('dishId = :dishId', {
          dishId: addDishDto.dishId,
        })
        .getRawAndEntities();

      const ingredientToList = entities.map((ingredient) => ({
        ingredientId: ingredient.ingredient.id,
        quantity: ingredient.quantity,
        measurementType: ingredient.measurementType,
      }));

      for (const ingredient of ingredientToList) {
        await this._shoppingListService.addGroupIngredient({
          groupId: group.id,
          ingredientId: ingredient.ingredientId,
          quantity: ingredient.quantity,
          measurementType: ingredient.measurementType,
          date: addDishDto.date,
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
        .where('dishId = :dishId', {
          dishId: addDishDto.dishId,
        })
        .getRawAndEntities();

      const ingredientToList = entities.map((ingredient) => ({
        ingredientId: ingredient.ingredient.id,
        quantity: ingredient.quantity,
        measurementType: ingredient.measurementType,
      }));

      for (const ingredient of ingredientToList) {
        await this._shoppingListService.addIngredient(
          {
            ingredientId: ingredient.ingredientId,
            quantity: ingredient.quantity,
            measurementType: ingredient.measurementType,
            date: addDishDto.date,
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
      },
      where: {
        dish: {
          id: dish.id,
        },
      },
    });

    const values = ingredients.map((ingredient) => ({
      ingredientId: ingredient.ingredient.id,
      shoppingListId: individualList.shoppingList.id,
    }));

    try {
      values.forEach(async (value) => {
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
      });
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
      },
      where: {
        dish: {
          id: dish.id,
        },
      },
    });

    const values = ingredients.map((ingredient) => ({
      ingredientId: ingredient.ingredient.id,
      shoppingListId: individualList.shoppingList.id,
    }));

    try {
      values.forEach(async (value) => {
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
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
