import { RecombeeService } from './../../../services/recombee/recombee.service';
import { AddDislikeDto } from './dto/request/addDislike.dto';
import { AddFavoriteDto } from './dto/request/addFavorite.dto';
import { AddAllergicDto } from './dto/request/addAllergic.dto';
import { UpdateUserDto } from './dto/request/updateUser.dto';
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
import { Allergic } from 'src/entities/Allergic';
import { Favorite } from 'src/entities/Favorite';
import { Dislike } from 'src/entities/Dislike';

@Injectable({})
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService)) private _authService: AuthService,
    @Inject(forwardRef(() => GroupService)) private _groupService: GroupService,
    @Inject(forwardRef(() => MenuService)) private _menuService: MenuService,
    @Inject(forwardRef(() => RecombeeService))
    private _recombeeService: RecombeeService,
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
        relations: {
          account: true,
        },
        where: { id },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }

  async findOneDislike(userId: string, dishId: string) {
    try {
      return await AppDataSource.getRepository(Dislike).findOne({
        relations: {
          user: true,
          dish: true,
        },
        where: {
          user: {
            id: userId,
          },
          dish: {
            id: dishId,
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }

  async findOneFavorite(userId: string, dishId: string) {
    try {
      return await AppDataSource.getRepository(Favorite).findOne({
        relations: {
          user: true,
          dish: true,
        },
        where: {
          user: {
            id: userId,
          },
          dish: {
            id: dishId,
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }

  async findByAccountId(accountId: string) {
    try {
      return await AppDataSource.getRepository(User).findOne({
        relations: {
          account: true,
        },
        where: { account: { id: accountId } },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }

  async update(id: string, userDto: UserDto) {
    try {
      await AppDataSource.createQueryBuilder()
        .update(User)
        .set(userDto)
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
        .leftJoinAndSelect('user.account', 'account')
        .where('accountId = :accountId', { accountId: sub.toString() })
        .getOneOrFail();
      return new PageDto('OK', HttpStatus.OK, {
        ...profile,
        group: group,
      });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async getProfileByUser(userId: string) {
    try {
      const user = await this.find(userId);
      const group = await this._groupService.findByUser(user);

      const profile = await AppDataSource.createQueryBuilder(User, 'user')
        .leftJoinAndSelect('user.account', 'account')
        .where('accountId = :accountId', { accountId: user.account.id })
        .getOneOrFail();
      return new PageDto('OK', HttpStatus.OK, {
        ...profile,
        group: group,
      });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async updateProfile(jwtUser: JwtUser, updateProfileDto: UpdateProfileDto) {
    try {
      const { sub } = jwtUser;
      const { firstName, lastName, sex, dob, imageUrl, ...userDto } =
        updateProfileDto;
      await this.updateByAccountId(sub.toString(), userDto);

      await this._authService.findOneAndUpdateById(sub.toString(), {
        firstName,
        lastName,
        sex,
        dob,
        imageUrl,
      });

      const user = await this.findByAccountId(sub.toString());

      await this._recombeeService.sendSetUser(user.id, updateProfileDto);
      await this.setUserBaseCalories(user);

      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async getBodyMassIndexByUser(userId: string) {
    try {
      const user = await this.find(userId);

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
      const account = await this._authService.findOneById(sub.toString());
      const user = await this.findByAccountId(sub.toString());

      const age = moment().diff(
        moment(account.dob, DateFormat.FULL_DATE),
        'years',
      );

      const currentBMR = this.bmr(user.weight, user.height, age, account.sex);

      const result = {
        currentBMR,
        dailyCalories: this.dailyCalories(currentBMR, user.activityIntensity),
      };

      return new PageDto('OK', HttpStatus.OK, result);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  public async insertAllergic(userId: string, addAllergicDto: AddAllergicDto) {
    try {
      const { ingredientIds, ...rest } = addAllergicDto;
      const values = ingredientIds.map((ingredientId) => {
        return {
          user: {
            id: userId,
          },
          ingredient: {
            id: ingredientId,
          },
          ...rest,
        };
      });
      return await AppDataSource.createQueryBuilder()
        .insert()
        .into(Allergic)
        .values(values)
        .execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('');
    }
  }

  public async insertFavorite(userId: string, addFavoriteDto: AddFavoriteDto) {
    try {
      const { dishIds, ...rest } = addFavoriteDto;

      const isFavoritesPromise = dishIds.map(async (dishId) => {
        const value = await this.findOneFavorite(userId, dishId);
        return {
          key: dishId,
          value,
        };
      });

      const isFavorites = await Promise.all(isFavoritesPromise);

      const filtered = isFavorites
        .filter((item) => item.value === null)
        .map((item) => item.key);

      const values = filtered.map((dishId) => {
        return {
          user: {
            id: userId,
          },
          dish: {
            id: dishId,
          },
          ...rest,
        };
      });

      filtered.forEach(async (dishId) => {
        await this._recombeeService.addFavoriteAddition({
          userId: userId,
          itemId: dishId,
          cascadeCreate: true,
        });
      });

      return await AppDataSource.createQueryBuilder()
        .insert()
        .into(Favorite)
        .values(values)
        .execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('');
    }
  }

  public async insertDislike(userId: string, addDislikeDto: AddDislikeDto) {
    try {
      const { dishIds, ...rest } = addDislikeDto;

      const isDislikesPromise = dishIds.map(async (dishId) => {
        const value = await this.findOneDislike(userId, dishId);
        return {
          key: dishId,
          value,
        };
      });

      const isDislikes = await Promise.all(isDislikesPromise);

      const filtered = isDislikes
        .filter((item) => item.value === null)
        .map((item) => item.key);

      const values = filtered.map((dishId) => {
        return {
          user: {
            id: userId,
          },
          dish: {
            id: dishId,
          },
          ...rest,
        };
      });

      return await AppDataSource.createQueryBuilder()
        .insert()
        .into(Dislike)
        .values(values)
        .execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('');
    }
  }

  public async deleteAllergic(id: string) {
    try {
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(Allergic)
        .where('id = :id', { id })
        .execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('');
    }
  }

  public async deleteFavorite(userId: string, dishId: string) {
    try {
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(Favorite)
        .where('userId = :userId and dishId = :dishId', { userId, dishId })
        .execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('');
    }
  }

  public async deleteDislike(userId: string, dishId: string) {
    try {
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(Dislike)
        .where('userId = :userId and dishId = :dishId', { userId, dishId })
        .execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('');
    }
  }

  public async findAllergicByUserId(userId: string) {
    try {
      return await AppDataSource.getRepository(Allergic).find({
        relations: {
          ingredient: true,
          user: true,
        },
        where: { user: { id: userId } },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }

  public async findFavoriteByUserId(userId: string) {
    try {
      return await AppDataSource.getRepository(Favorite).find({
        relations: {
          dish: true,
        },
        where: { user: { id: userId } },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }

  public async findDislikeByUserId(userId: string) {
    try {
      return await AppDataSource.getRepository(Dislike).find({
        relations: {
          dish: true,
        },
        where: { user: { id: userId } },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }

  public async getAllUser(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<User[]>> {
    const queryBuilder = AppDataSource.createQueryBuilder();

    queryBuilder
      .select('user')
      .from(User, 'user')
      .leftJoinAndSelect('user.account', 'account')
      .where(
        '(account.firstName like :name or account.lastName like :name) and account.role = :role',
        {
          name: `%${pageOptionsDto.search}%`,
          role: AccountRole.USER,
        },
      )
      .orderBy('user.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ total: itemCount, pageOptionsDto });

    return new PageDto('OK', HttpStatus.OK, entities, pageMetaDto);
  }

  public async createUser(
    updateUserDto: UpdateUserDto,
  ): Promise<PageDto<User>> {
    const hash = await argon.hash(updateUserDto?.password || 'happymeal');
    const newAccount: AccountDto = {
      email: updateUserDto.email,
      password: hash,
      role: AccountRole.USER,
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      imageUrl: updateUserDto.imageUrl,
      sex: updateUserDto.sex,
      dob: updateUserDto.dob,
    };
    await this._authService.insert(newAccount);

    const account = await this._authService.findOneByEmail(updateUserDto.email);

    try {
      const newUserId = await this.insert(updateUserDto);
      const user = await this.find(newUserId.raw.insertId);
      await this.bindAccount(user.id, account);

      await this._recombeeService.sendAddUser(user.id);

      await this._recombeeService.sendSetUser(user.id, updateUserDto);
      await this.setUserBaseCalories(user);

      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  public async updateUser(id: number, updateUserDto: UpdateUserDto) {
    try {
      const {
        email,
        firstName,
        lastName,
        sex,
        dob,
        imageUrl,
        password,
        ...profile
      } = updateUserDto;

      const user = await this.find(id.toString());

      await this._authService.updateById(user.account.id, {
        email,
        firstName,
        lastName,
        sex,
        dob,
        imageUrl,
      });
      await this.update(id.toString(), profile);

      await this._recombeeService.sendSetUser(user.id, updateUserDto);
      await this.setUserBaseCalories(user);
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  public async setUserBaseCalories(user: User) {
    try {
      const baseCalories = await this.getBaseByUser(user);
      await this._recombeeService.setUserBaseCalories({
        userId: user.id,
        baseCalories,
        cascadeCreate: true,
      });
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
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
      .leftJoinAndSelect('dish_to_menu.meal', 'meal')
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
      .leftJoinAndSelect('dish_to_menu.meal', 'meal')
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

  public async getBase(jwtUser: JwtUser) {
    const { sub } = jwtUser;
    const account = await this._authService.findOneById(sub.toString());
    const user = await this.findByAccountId(sub.toString());
    const age = moment().diff(
      moment(account.dob, DateFormat.FULL_DATE),
      'years',
    );
    const currentBMR = this.bmr(user.weight, user.height, age, account.sex);
    const baseCalories = this.dailyCalories(currentBMR, user.activityIntensity);

    return baseCalories;
  }

  public async getBaseByUser(user: User) {
    const account = await this._authService.findOneById(user.account.id);
    const age = moment().diff(
      moment(account.dob, DateFormat.FULL_DATE),
      'years',
    );
    const currentBMR = this.bmr(user.weight, user.height, age, account.sex);
    const baseCalories = this.dailyCalories(currentBMR, user.activityIntensity);

    return baseCalories;
  }

  public async getOverview(jwtUser: JwtUser, date: string) {
    try {
      const { sub } = jwtUser;
      const user = await this.findByAccountId(sub.toString());
      const account = await this._authService.findOneById(sub.toString());
      const age = moment().diff(
        moment(account.dob, DateFormat.FULL_DATE),
        'years',
      );
      const currentBMR = this.bmr(user.weight, user.height, age, account.sex);

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

  public async getOverviewByUser(userId: string, date: string) {
    try {
      const user = await this.findByAccountId(userId);
      const account = await this._authService.findOneById(user.account.id);
      const age = moment().diff(
        moment(account.dob, DateFormat.FULL_DATE),
        'years',
      );

      const jwtUser: JwtUser = {
        sub: parseInt(account.id, 10),
        email: '',
        iat: 0,
        exp: 0,
      };

      const currentBMR = this.bmr(user.weight, user.height, age, account.sex);

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

  public async addAllergic(jwtUser: JwtUser, addAllergicDto: AddAllergicDto) {
    try {
      const { sub } = jwtUser;
      const user = await this.findByAccountId(sub.toString());
      await this.insertAllergic(user.id, addAllergicDto);

      await this.setUserAllergic(user);

      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('');
    }
  }

  public async setUserAllergic(user: User) {
    try {
      const results = await this.findAllergicByUserId(user.id);
      const allergic = results.map((result) => {
        return result.ingredient.id;
      });
      await this._recombeeService.setUserAllergic({
        userId: user.id,
        allergic: allergic,
        cascadeCreate: true,
      });
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('');
    }
  }

  public async setUserFavorite(user: User) {
    try {
      const results = await this.findFavoriteByUserId(user.id);
      const favorite = results.map((result) => {
        return result.dish.id;
      });
      await this._recombeeService.setUserFavorite({
        userId: user.id,
        favorite: favorite,
        cascadeCreate: true,
      });
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('');
    }
  }

  public async setUserBlacklist(user: User) {
    try {
      const results = await this.findDislikeByUserId(user.id);
      const blacklist = results.map((result) => {
        return result.dish.id;
      });
      await this._recombeeService.setUserBlacklist({
        userId: user.id,
        blacklist: blacklist,
        cascadeCreate: true,
      });
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('');
    }
  }

  public async addFavorite(jwtUser: JwtUser, addFavoriteDto: AddFavoriteDto) {
    try {
      const { sub } = jwtUser;
      const user = await this.findByAccountId(sub.toString());

      const { dishIds } = addFavoriteDto;
      dishIds.forEach(async (dishId) => {
        const isDisliked = await this.findOneDislike(user.id, dishId);

        if (isDisliked) {
          await this.removeDislike(dishId, jwtUser);
        }
      });

      await this.insertFavorite(user.id, addFavoriteDto);

      await this.setUserFavorite(user);
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('');
    }
  }

  public async addDislike(jwtUser: JwtUser, addDislikeDto: AddDislikeDto) {
    try {
      const { sub } = jwtUser;
      const user = await this.findByAccountId(sub.toString());

      const { dishIds } = addDislikeDto;
      dishIds.forEach(async (dishId) => {
        const isFavorite = await this.findOneFavorite(user.id, dishId);

        if (isFavorite) {
          await this.removeFavorite(dishId, jwtUser);
        }
      });

      await this.insertDislike(user.id, addDislikeDto);
      await this.setUserBlacklist(user);
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('');
    }
  }

  public async removeAllergic(id: string, jwtUser: JwtUser) {
    try {
      const { sub } = jwtUser;
      await this.deleteAllergic(id);
      const user = await this.findByAccountId(sub.toString());
      await this.setUserAllergic(user);
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('');
    }
  }

  public async removeFavorite(id: string, jwtUser: JwtUser) {
    try {
      const { sub } = jwtUser;
      const user = await this.findByAccountId(sub.toString());

      await this._recombeeService.deleteFavoriteAddition({
        userId: user.id,
        itemId: id,
        cascadeCreate: true,
      });

      await this.deleteFavorite(user.id, id);
      await this.setUserFavorite(user);
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('');
    }
  }

  public async removeDislike(id: string, jwtUser: JwtUser) {
    try {
      const { sub } = jwtUser;
      const user = await this.findByAccountId(sub.toString());
      await this.deleteDislike(user.id, id);
      await this.setUserBlacklist(user);
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('');
    }
  }

  public async getAllergicByUser(jwtUser: JwtUser) {
    try {
      const { sub } = jwtUser;
      const user = await this.findByAccountId(sub.toString());
      const result = await this.findAllergicByUserId(user.id);
      return new PageDto('OK', HttpStatus.OK, result);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('');
    }
  }

  public async getFavoriteByUser(jwtUser: JwtUser) {
    try {
      const { sub } = jwtUser;
      const user = await this.findByAccountId(sub.toString());
      const result = await this.findFavoriteByUserId(user.id);
      return new PageDto('OK', HttpStatus.OK, result);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('');
    }
  }

  public async getDislikeByUser(jwtUser: JwtUser) {
    try {
      const { sub } = jwtUser;
      const user = await this.findByAccountId(sub.toString());
      const result = await this.findDislikeByUserId(user.id);
      return new PageDto('OK', HttpStatus.OK, result);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('');
    }
  }
}
