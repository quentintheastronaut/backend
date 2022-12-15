import { AuthService } from './../auth/auth.service';
import { MenuService } from './../menu/menu.service';
import { GroupService } from './../group/group.service';
import { UserToGroup } from './../../../entities/UserToGroup';
import { DishToMenu } from './../../../entities/DishToMenu';
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
  Inject,
  forwardRef,
} from '@nestjs/common';
import { UserDto } from './dto/request/user.dto';
import { AccountDto } from '../auth/dto/account.dto';
import { AccountRole } from 'src/constants/accountRole';
import { Account } from 'src/entities/Account';
import * as moment from 'moment';
import { DateFormat } from 'src/constants/dateFormat';
import * as argon from 'argon2';

@Injectable({})
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService)) private _authService: AuthService,
    @Inject(forwardRef(() => GroupService)) private _groupService: GroupService,
    @Inject(forwardRef(() => MenuService)) private _menuService: MenuService,
  ) {}

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

  async findByAccountId(accountId: string) {
    try {
      return await AppDataSource.getRepository(User).findOne({
        where: { account: { id: accountId } },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }

  async update(id: string, updateProfileDto: UpdateProfileDto) {
    try {
      await AppDataSource.createQueryBuilder()
        .update(User)
        .set(updateProfileDto)
        .where('id = :id', { id })
        .execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async updateByAccountId(
    accountId: string,
    updateProfileDto: UpdateProfileDto,
  ) {
    try {
      const user = await this.findByAccountId(accountId);

      await this.update(user.id, updateProfileDto);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async insert(userDto: UserDto) {
    try {
      return await AppDataSource.createQueryBuilder()
        .insert()
        .into(User)
        .values([userDto])
        .execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('');
    }
  }

  async bindAccount(id: string, account: Account) {
    try {
      await AppDataSource.createQueryBuilder()
        .update(User)
        .set({
          account: {
            id: account.id,
          },
        })
        .where('id = :id', { id })
        .execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async unbindAccount(id: string) {
    try {
      await AppDataSource.createQueryBuilder()
        .update(User)
        .set({
          account: null,
        })
        .where('id = :id', { id })
        .execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async getProfile(jwtUser: JwtUser) {
    try {
      const { sub } = jwtUser;
      const user = await this.findByAccountId(sub.toString());
      const group = await this._groupService.findByUser(user);
      const profile = await AppDataSource.createQueryBuilder(User, 'user')
        .where('accountId = :accountId', { accountId: sub.toString() })
        .getOneOrFail();
      return new PageDto('OK', HttpStatus.OK, {
        ...profile,
        group: group,
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async updateProfile(jwtUser: JwtUser, updateProfileDto: UpdateProfileDto) {
    try {
      const { sub } = jwtUser;
      console.log('sub', sub);
      await this.updateByAccountId(sub.toString(), updateProfileDto);

      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async getBodyMassIndex(jwtUser: JwtUser) {
    try {
      const { sub } = jwtUser;
      const user = await this.findByAccountId(sub.toString());

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
      const { sub } = jwtUser;
      const user = await this.findByAccountId(sub.toString());

      const age = moment().diff(
        moment(user.dob, DateFormat.FULL_DATE),
        'years',
      );

      const currentBMR = this.bmr(user.weight, user.height, age, user.sex);

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

  public async createUser(userDto: UserDto): Promise<PageDto<User>> {
    const hash = await argon.hash(userDto.password);
    const newAccount: AccountDto = {
      email: userDto.email,
      password: hash,
      role: AccountRole.USER,
    };
    await this._authService.insert(newAccount);

    const account = await this._authService.findOneByEmail(userDto.email);

    try {
      const newUserId = await this.insert(userDto);
      const user = await this.find(newUserId.raw.insertId);
      await this.bindAccount(user.id, account);

      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  public async updateUser(id: number, updateProfileDto: UpdateProfileDto) {
    try {
      await this.update(id.toString(), updateProfileDto);
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  public async deactivateUser(id: number): Promise<PageDto<User>> {
    await this.find(id.toString());

    try {
      await this.update(id.toString(), { active: false });
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async activateUser(id: number): Promise<PageDto<User>> {
    await this.find(id.toString());

    try {
      await this.update(id.toString(), { active: true });
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // done
  public async getMenuByDate(jwtUser: JwtUser, date: string) {
    const { sub } = jwtUser;
    const user = await this.findByAccountId(sub.toString());

    const individualMenu = await this._menuService.findIndividualMenu(
      date,
      user,
    );

    if (!individualMenu) {
      return [];
    }

    const dishes = await AppDataSource.createQueryBuilder(
      DishToMenu,
      'dish_to_menu',
    )
      .leftJoinAndSelect('dish_to_menu.dish', 'dish')
      .where('menuId = :menuId', { menuId: individualMenu.menu.id })
      .getMany();

    return dishes;
  }

  public async getGroupMenuByDate(jwtUser: JwtUser, date: string) {
    const { sub } = jwtUser;
    const user = await this.findByAccountId(sub.toString());

    const group = await this._groupService.findByUser(user);

    if (!group) {
      return [];
    }

    const groupMenu = await this._menuService.findGroupMenu(date, group);

    if (!groupMenu) {
      return [];
    }

    const dishes = await AppDataSource.createQueryBuilder(
      DishToMenu,
      'dish_to_menu',
    )
      .leftJoinAndSelect('dish_to_menu.dish', 'dish')
      .where('menuId = :menuId', { menuId: groupMenu.menu.id })
      .getMany();

    return dishes;
  }

  public async countMember(jwtUser: JwtUser) {
    const { sub } = jwtUser;
    const user = await this.findByAccountId(sub.toString());

    const group = await this._groupService.findByUser(user);

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
        return prev + curr.dish.calories * curr.quantity;
      }, 0);

    const group = groupDishes
      .filter((dish) => dish.tracked)
      .reduce((prev, curr) => {
        return (
          prev + Math.floor((curr.dish.calories * curr.quantity) / countMember)
        );
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
      return prev + curr.dish.calories * curr.quantity;
    }, 0);

    const group = groupDishes.reduce((prev, curr) => {
      return (
        prev + Math.floor((curr.dish.calories * curr.quantity) / countMember)
      );
    }, 0);

    return group + individual;
  }

  public async getTotalFatByDate(jwtUser: JwtUser, date: string) {
    const individualDishes = await this.getMenuByDate(jwtUser, date);
    const groupDishes = await this.getGroupMenuByDate(jwtUser, date);

    const countMember = await this.countMember(jwtUser);

    const individual = individualDishes.reduce((prev, curr) => {
      return prev + curr.dish.fat * curr.quantity;
    }, 0);

    const group = groupDishes.reduce((prev, curr) => {
      return prev + Math.floor((curr.dish.fat * curr.quantity) / countMember);
    }, 0);

    return group + individual;
  }
  public async getTotalProteinByDate(jwtUser: JwtUser, date: string) {
    const individualDishes = await this.getMenuByDate(jwtUser, date);
    const groupDishes = await this.getGroupMenuByDate(jwtUser, date);

    const countMember = await this.countMember(jwtUser);

    const individual = individualDishes.reduce((prev, curr) => {
      return prev + curr.dish.protein * curr.quantity;
    }, 0);

    const group = groupDishes.reduce((prev, curr) => {
      return (
        prev + Math.floor((curr.dish.protein * curr.quantity) / countMember)
      );
    }, 0);

    return group + individual;
  }
  public async getTotalCarbByDate(jwtUser: JwtUser, date: string) {
    const individualDishes = await this.getMenuByDate(jwtUser, date);
    const groupDishes = await this.getGroupMenuByDate(jwtUser, date);

    const countMember = await this.countMember(jwtUser);

    const individual = individualDishes.reduce((prev, curr) => {
      return prev + curr.dish.carbohydrates * curr.quantity;
    }, 0);

    const group = groupDishes.reduce((prev, curr) => {
      return (
        prev +
        Math.floor((curr.dish.carbohydrates * curr.quantity) / countMember)
      );
    }, 0);

    return group + individual;
  }

  public async getOverview(jwtUser: JwtUser, date: string) {
    try {
      const { sub } = jwtUser;
      const user = await this.findByAccountId(sub.toString());
      const age = moment().diff(
        moment(user.dob, DateFormat.FULL_DATE),
        'years',
      );
      const currentBMR = this.bmr(user.weight, user.height, age, user.sex);

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
