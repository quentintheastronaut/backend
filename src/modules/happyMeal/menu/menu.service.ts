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
} from '@nestjs/common';
import { PageDto } from 'src/dtos/page.dto';
import { PageMetaDto } from 'src/dtos/pageMeta.dto';
import { AddDishDto } from './dto/request/addDish.dto';
import { User } from 'src/entities';
import { RemoveDishDto } from './dto/request/removeDish.dto';
import { UpdateDishToMenuDto } from './dto/request/updateDishToMenu.dto';
import { ShoppingListStatus, ShoppingListType } from 'src/constants';

@Injectable({})
export class MenuService {
  async getUser(email: string) {
    const user = await AppDataSource.getRepository(User).findOne({
      where: {
        email,
      },
    });
    delete user.password;
    return user;
  }

  public async updateMenu(
    id: number,
    menuDto: MenuDto,
  ): Promise<PageDto<Menu>> {
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

  public async addDish(
    addDishDto: AddDishDto,
    jwtUser: JwtUser,
  ): Promise<PageDto<Menu>> {
    try {
      const { email } = jwtUser;
      const menu = await AppDataSource.getRepository(Menu).findOne({
        relations: {
          user: true,
        },
        where: {
          date: addDishDto.date,
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
    const { email } = jwtUser;
    const menu = await AppDataSource.getRepository(Menu).findOne({
      relations: {
        user: true,
      },
      where: {
        date: removeDishDto.date,
        user: {
          email: email,
        },
      },
    });

    if (!menu) {
      throw new BadRequestException('This plan is not existed !');
    }

    try {
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(DishToMenu)
        .where('dishId = :dishId and menuId = :menuId and meal = :meal', {
          ...removeDishDto,
          menuId: menu.id,
        })
        .execute();

      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async getMenuByDate(
    date: string,
    jwtUser: JwtUser,
  ): Promise<PageDto<DishToMenu[]>> {
    const { email } = jwtUser;
    let menu = await AppDataSource.getRepository(Menu).findOne({
      relations: {
        user: true,
      },
      where: {
        date,
        user: {
          email: email,
        },
      },
    });

    if (!menu) {
      const user = await this.getUser(email);
      await AppDataSource.createQueryBuilder()
        .insert()
        .into(Menu)
        .values([
          {
            date,
            user: user,
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
        user: {
          email: email,
        },
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

  public async addIngredientToList(addDisDto: AddDishDto, jwtUser: JwtUser) {
    const list = await AppDataSource.getRepository(ShoppingList).findOne({
      where: {
        date: addDisDto.date,
        userId: jwtUser.sub.toString(),
      },
    });

    if (!list) {
      try {
        const inserted = await this.createList(addDisDto, jwtUser);
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
      } catch (error) {
        throw new InternalServerErrorException(error);
      }
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
            type: ShoppingListType.INDIVIDUAL,
            status: ShoppingListStatus.PENDING,
          },
        ])
        .execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
