import { UserToGroup } from './../../../entities/UserToGroup';
import { DishToMenu } from './../../../entities/DishToMenu';
import { Menu } from 'src/entities/Menu';
import { Group } from 'src/entities/Group';
import { PhysicalActivityFactor } from './../../../constants/physicalAbilityFactor';
import { PageDto, PageOptionsDto, PageMetaDto } from 'src/dtos';
import { BodyMassIndex } from './../../../constants/bodyMassIndex';
import { SexType } from 'src/constants/sexType';
import { UpdateProfileDto } from './dto/request/updateProfile.dto';
import { User } from '../../../entities/User';
import { AppDataSource } from '../../../data-source';
import { JwtUser } from '../auth/dto/parsedToken.dto';
import {
  BadRequestException,
  Injectable,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UserDto } from './dto/request/user.dto';

@Injectable({})
export class UserService {
  convertKilogramsToPounds(kilograms: number): number {
    return kilograms * 2.2;
  }

  convertPoundsToKilograms(pounds: number): number {
    return pounds / 2.2;
  }

  convertCentimetersToInches(centimeters: number): number {
    return centimeters * 0.393700787;
  }

  convertInchesToCentimeters(inches: number): number {
    return inches / 0.393700787;
  }

  bmr(weight: number, height: number, age: number, sex: string) {
    if (sex === SexType.MALE) {
      return 66 + 13.7 * weight + 5 * height - 6.8 * age;
    }
    return 655 + 9.6 * weight + 1.8 * height - 4.7 * age;
  }

  bmi(weight: number, height: number) {
    const w = this.convertKilogramsToPounds(weight);
    const h = this.convertCentimetersToInches(height);
    return (w / (h * h)) * 703;
  }

  categorizeBMI(bmi: number) {
    if (bmi < 18.5) {
      return BodyMassIndex.UNDER_WEIGHT;
    } else if (bmi >= 18.5 && bmi < 25) {
      return BodyMassIndex.NORMAL_WEIGHT;
    } else if (bmi >= 25 && bmi < 30) {
      return BodyMassIndex.OVER_WEIGHT;
    } else if (bmi >= 30 && bmi < 35) {
      return BodyMassIndex.OBESE_CLASS_1;
    } else if (bmi >= 35 && bmi < 40) {
      return BodyMassIndex.OBESE_CLASS_2;
    }
    return BodyMassIndex.OBESE_CLASS_3;
  }

  dailyCalories(bmr: number, activityIntensity: string): number {
    switch (activityIntensity) {
      case PhysicalActivityFactor.SEDENTARY:
        return bmr * 1.2;
      case PhysicalActivityFactor.LIGHTLY_ACTIVE:
        return bmr * 1.375;
      case PhysicalActivityFactor.MODERATELY_ACTIVE:
        return bmr * 1.55;
      case PhysicalActivityFactor.VERY_ACTIVE:
        return bmr * 1.725;
      case PhysicalActivityFactor.EXTRA_ACTIVE:
        return bmr * 1.9;
      default:
        return bmr;
    }
  }

  async getProfile(jwtUser: JwtUser) {
    try {
      const { email } = jwtUser;
      const user = await AppDataSource.createQueryBuilder(User, 'user')
        .leftJoinAndMapOne(
          'user.group',
          Group,
          'group',
          'user.groupId = group.id',
        )
        .where('email = :email', { email })
        .getOneOrFail();
      delete user.password;
      return new PageDto('OK', HttpStatus.OK, user);
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async updateProfile(jwtUser: JwtUser, updateProfileDto: UpdateProfileDto) {
    try {
      const { email } = jwtUser;
      await AppDataSource.createQueryBuilder()
        .update(User)
        .set(updateProfileDto)
        .where('email = :email', { email: email })
        .execute();

      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async getBodyMassIndex(jwtUser: JwtUser) {
    try {
      const { email } = jwtUser;
      const user = await AppDataSource.getRepository(User).findOne({
        where: {
          email,
        },
      });

      const currentBMI = this.bmi(user.weight, user.height);

      const result = {
        currentBMI,
        type: this.categorizeBMI(currentBMI),
      };

      return new PageDto('OK', HttpStatus.OK, result);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async getBasalMetabolicRate(jwtUser: JwtUser) {
    try {
      const { email } = jwtUser;
      const user = await AppDataSource.getRepository(User).findOne({
        where: {
          email,
        },
      });

      const currentBMR = this.bmr(user.weight, user.height, user.age, user.sex);

      const result = {
        currentBMR,
        dailyCalories: this.dailyCalories(currentBMR, user.activityIntensity),
      };

      return new PageDto('OK', HttpStatus.OK, result);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  public async getAllUser(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<User[]>> {
    const queryBuilder = AppDataSource.createQueryBuilder();

    queryBuilder
      .select('user')
      .from(User, 'user')
      .where('user.firstName like :name or user.lastName like :name', {
        name: `%${pageOptionsDto.search}%`,
      })
      .orderBy('user.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ total: itemCount, pageOptionsDto });

    return new PageDto('OK', HttpStatus.OK, entities, pageMetaDto);
  }

  public async isValidEmail(email: string) {
    try {
      const user = await AppDataSource.getRepository(User).findOne({
        where: {
          email,
        },
      });
      return user ? true : false;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async createUser(userDto: UserDto): Promise<PageDto<User>> {
    if (await this.isValidEmail(userDto.email)) {
      throw new ForbiddenException('Credentials taken');
    }

    try {
      await AppDataSource.createQueryBuilder()
        .insert()
        .into(User)
        .values([userDto])
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  public async updateUser(id: number, updateProfileDto: UpdateProfileDto) {
    try {
      await AppDataSource.createQueryBuilder()
        .update(User)
        .set(updateProfileDto)
        .where('id = :id', { id: id.toString() })
        .execute();

      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  public async deactivateUser(id: number): Promise<PageDto<User>> {
    const user = await AppDataSource.getRepository(User).findOne({
      where: {
        id: id.toString(),
      },
    });

    if (!user) {
      throw new NotFoundException('Not found');
    }
    try {
      await AppDataSource.createQueryBuilder()
        .update(User)
        .set({
          active: false,
        })
        .where('id = :id', { id })
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async activateUser(id: number): Promise<PageDto<User>> {
    const user = await AppDataSource.getRepository(User).findOne({
      where: {
        id: id.toString(),
      },
    });

    if (!user) {
      throw new NotFoundException('Not found');
    }
    try {
      await AppDataSource.createQueryBuilder()
        .update(User)
        .set({
          active: true,
        })
        .where('id = :id', { id })
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async getMenuByDate(jwtUser: JwtUser, date: string) {
    const { email } = jwtUser;
    const menu = await AppDataSource.getRepository(Menu).findOne({
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
      return [];
    }

    const dishes = await AppDataSource.createQueryBuilder(
      DishToMenu,
      'dish_to_menu',
    )
      .leftJoinAndSelect('dish_to_menu.dish', 'dish')
      .where('menuId = :menuId', { menuId: menu.id })
      .getMany();

    return dishes;
  }

  public async getGroupMenuByDate(jwtUser: JwtUser, date: string) {
    const { email } = jwtUser;

    const user = await AppDataSource.getRepository(User).findOne({
      where: {
        email,
      },
    });

    const group = await AppDataSource.getRepository(Group).findOne({
      where: {
        id: user.groupId,
      },
    });

    if (!group) {
      return [];
    }

    const menu = await AppDataSource.getRepository(Menu).findOne({
      relations: {
        group: true,
      },
      where: {
        date,
        group: {
          id: group.id,
        },
      },
    });

    if (!menu) {
      return [];
    }

    const dishes = await AppDataSource.createQueryBuilder(
      DishToMenu,
      'dish_to_menu',
    )
      .leftJoinAndSelect('dish_to_menu.dish', 'dish')
      .where('menuId = :menuId', { menuId: menu.id })
      .getMany();

    return dishes;
  }

  public async countMember(jwtUser: JwtUser) {
    const { email } = jwtUser;

    const user = await AppDataSource.getRepository(User).findOne({
      where: {
        email,
      },
    });

    const group = await AppDataSource.getRepository(Group).findOne({
      where: {
        id: user.groupId,
      },
    });

    if (!group) {
      return 1;
    }

    return await AppDataSource.createQueryBuilder(UserToGroup, 'user_to_group')
      .select()
      .where('groupId = :groupId', { groupId: group.id })
      .getCount();
  }

  public async getCurrentCalories(
    jwtUser: JwtUser,
    date: string,
  ): Promise<number> {
    const individualDishes = await this.getMenuByDate(jwtUser, date);
    const groupDishes = await this.getGroupMenuByDate(jwtUser, date);

    const countMember = await this.countMember(jwtUser);

    const individual = individualDishes
      .filter((dish) => dish.tracked)
      .reduce((prev, curr) => {
        return prev + curr.dish.calories;
      }, 0);

    const group = groupDishes
      .filter((dish) => dish.tracked)
      .reduce((prev, curr) => {
        return prev + Math.floor(curr.dish.calories / countMember);
      }, 0);

    return group + individual;
  }

  public async getTotalCalories(
    jwtUser: JwtUser,
    date: string,
  ): Promise<number> {
    const individualDishes = await this.getMenuByDate(jwtUser, date);
    const groupDishes = await this.getGroupMenuByDate(jwtUser, date);

    const countMember = await this.countMember(jwtUser);

    const individual = individualDishes.reduce((prev, curr) => {
      return prev + curr.dish.calories;
    }, 0);

    const group = groupDishes.reduce((prev, curr) => {
      return prev + Math.floor(curr.dish.calories / countMember);
    }, 0);

    return group + individual;
  }

  public async getTotalFatByDate(jwtUser: JwtUser, date: string) {
    const individualDishes = await this.getMenuByDate(jwtUser, date);
    const groupDishes = await this.getGroupMenuByDate(jwtUser, date);

    const countMember = await this.countMember(jwtUser);

    const individual = individualDishes.reduce((prev, curr) => {
      return prev + curr.dish.fat;
    }, 0);

    const group = groupDishes.reduce((prev, curr) => {
      return prev + Math.floor(curr.dish.fat / countMember);
    }, 0);

    return group + individual;
  }
  public async getTotalProteinByDate(jwtUser: JwtUser, date: string) {
    const individualDishes = await this.getMenuByDate(jwtUser, date);
    const groupDishes = await this.getGroupMenuByDate(jwtUser, date);

    const countMember = await this.countMember(jwtUser);

    const individual = individualDishes.reduce((prev, curr) => {
      return prev + curr.dish.protein;
    }, 0);

    const group = groupDishes.reduce((prev, curr) => {
      return prev + Math.floor(curr.dish.protein / countMember);
    }, 0);

    return group + individual;
  }
  public async getTotalCarbByDate(jwtUser: JwtUser, date: string) {
    const individualDishes = await this.getMenuByDate(jwtUser, date);
    const groupDishes = await this.getGroupMenuByDate(jwtUser, date);

    const countMember = await this.countMember(jwtUser);

    const individual = individualDishes.reduce((prev, curr) => {
      return prev + curr.dish.carbohydrates;
    }, 0);

    const group = groupDishes.reduce((prev, curr) => {
      return prev + Math.floor(curr.dish.carbohydrates / countMember);
    }, 0);

    return group + individual;
  }

  public async getOverview(jwtUser: JwtUser, date: string) {
    try {
      const { email } = jwtUser;
      const user = await AppDataSource.getRepository(User).findOne({
        where: {
          email,
        },
      });

      const currentBMR = this.bmr(user.weight, user.height, user.age, user.sex);

      const currentCalories = await this.getCurrentCalories(jwtUser, date);
      const totalCalories = await this.getTotalCalories(jwtUser, date);
      const baseCalories = this.dailyCalories(
        currentBMR,
        user.activityIntensity,
      );
      const protein = await this.getTotalProteinByDate(jwtUser, date);
      const fat = await this.getTotalFatByDate(jwtUser, date);
      const carb = await this.getTotalCarbByDate(jwtUser, date);

      const result = {
        baseCalories: Math.floor(baseCalories),
        currentCalories: Math.floor(currentCalories),
        totalCalories: Math.floor(totalCalories),
        protein: Math.floor(protein),
        fat: Math.floor(fat),
        carb: Math.floor(carb),
      };
      return new PageDto('OK', HttpStatus.OK, result);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
