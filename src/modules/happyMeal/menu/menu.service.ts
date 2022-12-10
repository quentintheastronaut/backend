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

@Injectable({})
export class MenuService {
  constructor(
    @Inject(forwardRef(() => UserService)) private _userService: UserService,
    @Inject(forwardRef(() => DishService)) private _dishService: DishService,
    @Inject(forwardRef(() => GroupService)) private _groupService: GroupService,
    @Inject(forwardRef(() => MenuService)) private _menuService: MenuService,
    @Inject(forwardRef(() => ShoppingListService))
    private _shoppingListService: ShoppingListService,
  ) {}

  // COMMON SERVICE
  async find(id: string) {
    try {
      return await AppDataSource.getRepository(User).findOne({
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
        },
        where: { date, group },
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
        },
        where: { date, user },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }

  // CONTROLLER SERVICES

  public async updateMenu(
    id: number,
    menuDto: MenuDto,
  ): Promise<PageDto<Menu>> {
    const menu = await this.find(id.toString());

    if (!menu) {
      throw new NotFoundException('Not found');
    }
    try {
      await AppDataSource.createQueryBuilder()
        .update(Menu)
        .set(menuDto)
        .where('id = :id', { id })
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async createMenu(menuDto: MenuDto): Promise<PageDto<Menu>> {
    try {
      await AppDataSource.createQueryBuilder()
        .insert()
        .into(Menu)
        .values([menuDto])
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async deleteMenu(id: number): Promise<PageDto<Menu>> {
    const menu = await AppDataSource.getRepository(Menu).findOne({
      where: {
        id: id.toString(),
      },
    });

    if (!menu) {
      throw new NotFoundException('Not found');
    }
    try {
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(Menu)
        .where('id = :id', { id })
        .execute();
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

      const groupMenu = this._menuService.findGroupMenu(date, group);

      if (!groupMenu) {
        const newMenuId = await AppDataSource.createQueryBuilder()
          .insert()
          .into(Menu)
          .values({
            date: addGroupDishDto.date,
            group: group,
          })
          .execute();

        await AppDataSource.createQueryBuilder()
          .insert()
          .into(DishToMenu)
          .values({
            menuId: newMenuId.identifiers[0].id,
            ...addGroupDishDto,
          })
          .execute();
      } else {
        await AppDataSource.createQueryBuilder()
          .insert()
          .into(DishToMenu)
          .values({
            menuId: menu.id,
            ...addGroupDishDto,
          })
          .execute();
      }

      await this.addIngredientToList(addGroupDishDto, null);

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
      const user = await this._userService.findByAccountId(sub.toString());

      const menu = await AppDataSource.getRepository(Menu).findOne({
        relations: {
          user: true,
        },
        where: {
          date: addDishDto.date,
          user: user,
        },
      });

      if (!menu) {
        const newMenuId = await AppDataSource.createQueryBuilder()
          .insert()
          .into(Menu)
          .values({
            date: addDishDto.date,
            user: user,
          })
          .execute();

        await AppDataSource.createQueryBuilder()
          .insert()
          .into(DishToMenu)
          .values({
            menuId: newMenuId.identifiers[0].id,
            ...addDishDto,
          })
          .execute();
      } else {
        await AppDataSource.createQueryBuilder()
          .insert()
          .into(DishToMenu)
          .values({
            menuId: menu.id,
            ...addDishDto,
          })
          .execute();
      }
      await this.addIngredientToList(addDishDto, jwtUser);

      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async removeDish(
    removeDishDto: RemoveDishDto,
    jwtUser: JwtUser,
  ): Promise<PageDto<Menu>> {
    const dishToMenu = await AppDataSource.getRepository(DishToMenu).findOne({
      where: {
        dishToMenuId: removeDishDto.dishToMenuId,
      },
    });

    if (!dishToMenu) {
      throw new BadRequestException('This dish is not existed in this menu !');
    }

    const menu = await AppDataSource.getRepository(Menu).findOne({
      relations: {
        group: true,
        user: true,
      },
      where: {
        id: dishToMenu.menuId,
      },
    });

    if (!menu) {
      throw new BadRequestException('This menu is not existed !');
    }

    const date = menu.date;

    try {
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(DishToMenu)
        .where('dishToMenuId = :dishToMenuId', {
          ...removeDishDto,
        })
        .execute();

      if (menu.type === ShoppingListType.GROUP) {
        await this.removeGroupIngredient(
          date,
          menu.group.id,
          dishToMenu.dishId,
        );
      } else {
        await this.removeIngredient(
          date,
          jwtUser.sub.toString(),
          dishToMenu.dishId,
        );
      }

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
      const group = await AppDataSource.getRepository(Group).findOne({
        where: {
          id: groupId,
        },
      });

      if (!group) {
        throw new NotFoundException('This group is not existed !');
      }

      let menu = await AppDataSource.getRepository(Menu).findOne({
        relations: {
          group: true,
        },
        where: {
          date,
          group: {
            id: groupId,
          },
        },
      });

      if (!menu) {
        await AppDataSource.createQueryBuilder()
          .insert()
          .into(Menu)
          .values([
            {
              date,
              group: group,
              type: ShoppingListType.GROUP,
            },
          ])
          .execute();
      }

      menu = await AppDataSource.getRepository(Menu).findOne({
        relations: {
          user: true,
        },
        where: {
          date,
          group: {
            id: groupId,
          },
        },
      });

      const result = await AppDataSource.createQueryBuilder(
        DishToMenu,
        'dish_to_menu',
      )
        .leftJoinAndSelect('dish_to_menu.dish', 'dish')
        .where('menuId = :menuId', { menuId: menu.id })
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

    let menu = await AppDataSource.getRepository(Menu).findOne({
      relations: {
        user: true,
      },
      where: {
        date,
        user: user,
      },
    });

    if (!menu) {
      await AppDataSource.createQueryBuilder()
        .insert()
        .into(Menu)
        .values([
          {
            date,
            user: user,
            type: ShoppingListType.INDIVIDUAL,
          },
        ])
        .execute();
    }

    menu = await AppDataSource.getRepository(Menu).findOne({
      relations: {
        user: true,
      },
      where: {
        date,
        user: user,
      },
    });

    try {
      const result = await AppDataSource.createQueryBuilder(
        DishToMenu,
        'dish_to_menu',
      )
        .leftJoinAndSelect('dish_to_menu.dish', 'dish')
        .where('menuId = :menuId', { menuId: menu.id })
        .getMany();

      return new PageDto('OK', HttpStatus.OK, result);
    } catch (error) {
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

  public async addIngredientToList(addDisDto: any, jwtUser: JwtUser) {
    const condition = !addDisDto.groupId
      ? { userId: jwtUser.sub.toString() }
      : {
          groupId: addDisDto.groupId,
        };

    const list = await AppDataSource.getRepository(ShoppingList).findOne({
      where: {
        date: addDisDto.date,
        ...condition,
      },
    });

    try {
      if (!list) {
        const inserted = !addDisDto.groupId
          ? await this.createList(addDisDto, jwtUser)
          : await this.createGroupList(addDisDto, addDisDto.groupId);
        const listId = inserted.identifiers[0].id;

        const { entities } = await AppDataSource.createQueryBuilder()
          .select('ingredientToDish')
          .from(IngredientToDish, 'ingredientToDish')
          .where('dishId = :dishId', {
            dishId: addDisDto.dishId,
          })
          .getRawAndEntities();

        const ingredientToList = entities.map((ingredient) => ({
          ingredientId: ingredient.ingredientId,
          shoppingListId: listId,
          quantity: ingredient.quantity,
          measurementType: ingredient.measurementType,
          weight: ingredient.weight,
        }));

        await AppDataSource.createQueryBuilder()
          .insert()
          .into(IngredientToShoppingList)
          .values(ingredientToList)
          .execute();
      } else {
        const listId = list.id;

        const { entities } = await AppDataSource.createQueryBuilder()
          .select('ingredientToDish')
          .from(IngredientToDish, 'ingredientToDish')
          .where('dishId = :dishId', {
            dishId: addDisDto.dishId,
          })
          .getRawAndEntities();

        const ingredientToList = entities.map((ingredient) => ({
          ingredientId: ingredient.ingredientId,
          shoppingListId: listId,
          quantity: ingredient.quantity,
          measurementType: ingredient.measurementType,
          weight: ingredient.weight,
        }));

        await AppDataSource.createQueryBuilder()
          .insert()
          .into(IngredientToShoppingList)
          .values(ingredientToList)
          .execute();
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  public async createList(addDisDto: AddDishDto, jwtUser: JwtUser) {
    try {
      return await AppDataSource.createQueryBuilder()
        .insert()
        .into(ShoppingList)
        .values([
          {
            date: addDisDto.date,
            userId: jwtUser.sub.toString(),
            status: ShoppingListStatus.PENDING,
          },
        ])
        .execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
  public async createGroupList(addDisDto: AddDishDto, groupId: string) {
    try {
      return await AppDataSource.createQueryBuilder()
        .insert()
        .into(ShoppingList)
        .values([
          {
            date: addDisDto.date,
            groupId,
            status: ShoppingListStatus.PENDING,
          },
        ])
        .execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  public async removeIngredient(date: string, userId: string, dishId: string) {
    const user = await this._userService.find(userId);

    const individualList =
      await this._shoppingListService.findIndividualShoppingList(date, user.id);

    const dish = await this._dishService.find(dishId);

    const ingredients = await AppDataSource.getRepository(
      IngredientToDish,
    ).find({
      relations: {
        dish: true,
      },
      where: {
        dish: dish,
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

  public async removeGroupIngredient(
    date: string,
    groupId: string,
    dishId: string,
  ) {
    const groupList = await this._shoppingListService.findGroupShoppingList(
      date,
      groupId,
    );

    const ingredients = await AppDataSource.getRepository(
      IngredientToDish,
    ).find({
      relations: {
        dish: true,
      },
      where: {
        dish: {
          id: dishId,
        },
      },
    });

    const values = ingredients.map((ingredient) => ({
      ingredientId: ingredient.ingredient.id,
      shoppingListId: groupList.shoppingList.id,
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
