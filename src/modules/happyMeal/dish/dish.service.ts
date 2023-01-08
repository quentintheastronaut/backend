import { UserService } from './../user/user.service';
import { JwtUser } from './../auth/dto/parsedToken.dto';
import { RecombeeService } from './../../../services/recombee/recombee.service';
import { Ingredient } from 'src/entities/Ingredient';
import { AddIngredientDto } from './../shoppingList/dto/request/addIngredient.dto';
import { IngredientService } from './../ingredient/ingredient.service';
import { IngredientToDish } from './../../../entities/IngredientToDish';
import { AddIngredientToDishDto } from './dto/request/addIngredient.dto';
import { DishDto } from './dto/request/dish.dto';
import { AppDataSource } from './../../../data-source';
import { PageOptionsDto } from './../../../dtos/pageOption.dto';
import {
  Injectable,
  InternalServerErrorException,
  HttpStatus,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { PageDto } from 'src/dtos/page.dto';
import { PageMetaDto } from 'src/dtos/pageMeta.dto';
import { Dish } from 'src/entities/Dish';
import { Inject } from '@nestjs/common';
import { MeasurementService } from '../measurement/measurement.service';

@Injectable({})
export class DishService {
  constructor(
    @Inject(forwardRef(() => IngredientService))
    private _ingredientService: IngredientService,
    @Inject(forwardRef(() => MeasurementService))
    private _measurementService: MeasurementService,
    @Inject(forwardRef(() => RecombeeService))
    private _recombeeService: RecombeeService,
    @Inject(forwardRef(() => UserService))
    private _userService: UserService,
  ) {}

  // COMMON SERVICES
  public async find(id: string) {
    try {
      return await AppDataSource.getRepository(Dish).findOne({
        relations: {
          foodCategory: true,
        },
        where: { id },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }

  public async insertIngredientToDish(
    addIngredientToDishDto: AddIngredientToDishDto,
    dish: Dish,
    ingredient: Ingredient,
  ) {
    try {
      const measurementType = await this._measurementService.find(
        addIngredientToDishDto.measurementTypeId,
      );

      await AppDataSource.createQueryBuilder()
        .insert()
        .into(IngredientToDish)
        .values([
          {
            ...addIngredientToDishDto,
            measurementType,
            ingredient,
            dish: {
              id: addIngredientToDishDto.dishId,
            },
          },
        ])
        .execute();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // CONTROLLER SERVICES
  public async getIngredient(dishId) {
    try {
      const result = await AppDataSource.createQueryBuilder(
        IngredientToDish,
        'ingredient_to_dish',
      )
        .leftJoinAndSelect('ingredient_to_dish.ingredient', 'ingredient')
        .leftJoinAndSelect('ingredient_to_dish.measurementType', 'measurement')
        .where('ingredient_to_dish.dishId = :dishId', { dishId })
        .getMany();
      return new PageDto('OK', HttpStatus.OK, result);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async updateDish(
    id: number,
    dishDto: DishDto,
  ): Promise<PageDto<Dish>> {
    const dish = await AppDataSource.getRepository(Dish).findOne({
      where: {
        id: id.toString(),
      },
    });

    if (!dish) {
      throw new NotFoundException('Not found');
    }
    try {
      const { foodCategoryId, ...rest } = dishDto;
      await AppDataSource.createQueryBuilder()
        .update(Dish)
        .set({
          ...rest,
          foodCategory: {
            id: foodCategoryId,
          },
        })
        .where('id = :id', { id })
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async addIngredient(addIngredientDto: AddIngredientToDishDto) {
    try {
      const dish = await this.find(addIngredientDto.dishId);
      const ingredient = await this._ingredientService.findOne(
        addIngredientDto.ingredientId,
      );

      await this.insertIngredientToDish(addIngredientDto, dish, ingredient);

      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async updateIngredient(
    addIngredientToDishDto: AddIngredientToDishDto,
  ) {
    try {
      await AppDataSource.createQueryBuilder()
        .update(IngredientToDish)
        .set({
          quantity: addIngredientToDishDto.quantity,
          measurementType: {
            id: addIngredientToDishDto.measurementTypeId,
          },
        })
        .where('dishId = :dishId AND ingredientId = :ingredientId', {
          dishId: addIngredientToDishDto.dishId,
          ingredientId: addIngredientToDishDto.ingredientId,
        })
        .execute();

      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  public async removeIngredient(id: number) {
    try {
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(IngredientToDish)
        .where('ingredientToDishId = :id', {
          id: id.toString(),
        })
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  public async createDish(dishDto: DishDto): Promise<PageDto<Dish>> {
    try {
      const { foodCategoryId, ...rest } = dishDto;
      await AppDataSource.createQueryBuilder()
        .insert()
        .into(Dish)
        .values([
          {
            ...rest,
            foodCategory: {
              id: foodCategoryId,
            },
          },
        ])
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async deleteDish(id: number): Promise<PageDto<Dish>> {
    const dish = await AppDataSource.getRepository(Dish).findOne({
      where: {
        id: id.toString(),
      },
    });

    if (!dish) {
      throw new NotFoundException('Not found');
    }
    try {
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(Dish)
        .where('id = :id', { id })
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async getAllDishes(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Dish[]>> {
    const queryBuilder = AppDataSource.createQueryBuilder();

    queryBuilder
      .select('dish')
      .from(Dish, 'dish')
      .leftJoinAndSelect('dish.foodCategory', 'foodCategory')
      .where('dish.name like :name OR foodCategory.name like :name', {
        name: `%${pageOptionsDto.search}%`,
      })
      .orderBy('dish.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ total: itemCount, pageOptionsDto });

    return new PageDto('OK', HttpStatus.OK, entities, pageMetaDto);
  }

  public async getDishDetail(
    id: string,
    jwtUser: JwtUser,
  ): Promise<PageDto<Dish>> {
    try {
      const { sub } = jwtUser;
      const dish = await AppDataSource.getRepository(Dish).findOne({
        relations: {
          foodCategory: true,
        },
        where: {
          id,
        },
      });

      const user = await this._userService.findByAccountId(sub.toString());

      await this._recombeeService.sendViewDetail({
        itemId: dish.id,
        userId: user.id,
        cascadeCreate: true,
      });

      return new PageDto('OK', HttpStatus.OK, dish);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
