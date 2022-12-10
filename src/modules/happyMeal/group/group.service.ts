import { Menu } from 'src/entities/Menu';
import { ShoppingList } from 'src/entities/ShoppingList';
import { IngredientToShoppingList } from './../../../entities/IngredientToShoppingList';
import { RemoveMemberDto } from './dto/request/removeMember.dto';
import { AddMemberDto } from './dto/request/addMember.dto';
import { UserToGroup } from '../../../entities/UserToGroup';
import { JwtUser } from './../auth/dto/parsedToken.dto';
import { AppDataSource } from './../../../data-source';
import {
  Injectable,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Group } from 'src/entities/Group';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/dtos';
import { GroupDto } from './dto/request/group.dto';
import { User } from 'src/entities';
import { GroupRole } from 'src/constants/groupRole';
import { DishToMenu } from 'src/entities/DishToMenu';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { forwardRef } from '@nestjs/common';

@Injectable({})
export class GroupService {
  constructor(
    @Inject(forwardRef(() => UserService)) private _userService: UserService,
    private _authService: AuthService,
  ) {}

  // COMMON SERVICE
  public async find(id: string) {
    try {
      return await AppDataSource.getRepository(Group).findOne({
        where: { id },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }

  public async findByUser(user: User) {
    try {
      const userToGroup = await AppDataSource.getRepository(
        UserToGroup,
      ).findOne({
        relations: {
          user: true,
        },
        where: { user },
      });

      return await AppDataSource.getRepository(Group).findOne({
        where: {
          id: userToGroup.groupId,
        },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }

  // CONTROLLER SERVICE
  // done
  public async updateGroup(
    id: number,
    groupDto: GroupDto,
  ): Promise<PageDto<Group>> {
    const group = await AppDataSource.getRepository(Group).findOne({
      where: {
        id: id.toString(),
      },
    });

    if (!group) {
      throw new NotFoundException('Not found');
    }
    try {
      await AppDataSource.createQueryBuilder()
        .update(Group)
        .set(groupDto)
        .where('id = :id', { id })
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // done
  public async createGroup(
    groupDto: GroupDto,
    jwtUser: JwtUser,
  ): Promise<PageDto<Group>> {
    const group = await AppDataSource.getRepository(Group).findOne({
      where: {
        name: groupDto.name,
      },
    });

    if (group) {
      throw new ForbiddenException('Credentials taken');
    }

    const { sub } = jwtUser;
    const user = await this._userService.findByAccountId(sub.toString());

    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      await AppDataSource.createQueryBuilder()
        .insert()
        .into(Group)
        .values([groupDto])
        .execute();
    } catch (error) {
      throw new InternalServerErrorException();
    }

    const newGroup = await AppDataSource.getRepository(Group).findOne({
      where: {
        name: groupDto.name,
      },
    });

    try {
      await AppDataSource.createQueryBuilder()
        .insert()
        .into(UserToGroup)
        .values([
          {
            userId: user.id.toString(),
            groupId: newGroup.id.toString(),
            role: GroupRole.ADMIN,
          },
        ])
        .execute();

      return new PageDto('OK', HttpStatus.OK, newGroup);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // done
  public async deleteGroup(id: number): Promise<PageDto<Group>> {
    try {
      const group = await AppDataSource.getRepository(Group).findOne({
        where: {
          id: id.toString(),
        },
      });

      const shoppingLists = await AppDataSource.getRepository(
        ShoppingList,
      ).find({
        where: {
          groupId: id.toString(),
        },
      });

      const menus = await AppDataSource.getRepository(Menu).find({
        where: {
          group: group,
        },
      });

      if (menus) {
        menus.forEach(async (menu) => {
          await AppDataSource.createQueryBuilder()
            .delete()
            .from(DishToMenu)
            .where('menuId = :id', { id: menu.id })
            .execute();
        });
      }

      if (shoppingLists) {
        shoppingLists.forEach(async (shoppingList) => {
          await AppDataSource.createQueryBuilder()
            .delete()
            .from(IngredientToShoppingList)
            .where('shoppingId = :id', { id: shoppingList.id })
            .execute();
        });
      }

      await AppDataSource.createQueryBuilder()
        .delete()
        .from(UserToGroup)
        .where('groupId = :id', { id })
        .execute();

      await AppDataSource.createQueryBuilder()
        .delete()
        .from(Group)
        .where('id = :id', { id })
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  public async getAllGroups(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Group[]>> {
    const queryBuilder = AppDataSource.createQueryBuilder();

    queryBuilder
      .select('group')
      .from(Group, 'group')
      .where('group.name like :name', {
        name: `%${pageOptionsDto.search}%`,
      })
      .orderBy('group.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ total: itemCount, pageOptionsDto });

    return new PageDto('OK', HttpStatus.OK, entities, pageMetaDto);
  }

  public async getGroupDetail(id: string): Promise<PageDto<Group>> {
    try {
      const group = await AppDataSource.getRepository(Group).findOne({
        where: {
          id,
        },
      });
      return new PageDto('OK', HttpStatus.OK, group);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async getGroupByUserId(
    jwtUser: JwtUser,
  ): Promise<PageDto<UserToGroup[]>> {
    const { sub } = jwtUser;
    try {
      const result = await AppDataSource.createQueryBuilder(
        UserToGroup,
        'user_to_group',
      )
        .leftJoinAndSelect('user_to_group.group', 'group')
        .where('userId = :userId', { userId: sub })
        .getMany();

      return new PageDto('OK', HttpStatus.OK, result);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async hasGroup(userId: string) {
    try {
      const user = await AppDataSource.getRepository(UserToGroup).findOne({
        where: {
          userId,
        },
      });
      return user ? true : false;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async isAdmin(userId: string, groupId: string) {
    try {
      const user = await AppDataSource.getRepository(UserToGroup).findOne({
        where: {
          userId,
          groupId,
        },
      });
      return user.role == GroupRole.ADMIN;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async addMember(
    jwtUser: JwtUser,
    addMemberDto: AddMemberDto,
  ): Promise<PageDto<Group>> {
    const { sub } = jwtUser;

    if (!(await this.isAdmin(sub.toString(), addMemberDto.groupId))) {
      throw new UnauthorizedException(
        "You don't have permission to add new member.",
      );
    }

    if (!(await this._authService.isExistedEmail(addMemberDto.email))) {
      throw new BadRequestException('This user is not existed !');
    }

    const newUser = await this._userService.find(sub.toString());

    if (await this.hasGroup(newUser.id)) {
      throw new BadRequestException('This user is already in another group !');
    }

    try {
      await AppDataSource.createQueryBuilder()
        .insert()
        .into(UserToGroup)
        .values({
          groupId: addMemberDto.groupId,
          userId: newUser.id,
          role: GroupRole.MEMBER,
        })
        .execute();

      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async getAllMembers(id: string): Promise<PageDto<UserToGroup[]>> {
    const group = await AppDataSource.getRepository(Group).findOne({
      where: {
        id,
      },
    });
    if (!group) {
      throw new BadRequestException('This group is not existed !');
    }

    try {
      const result = await AppDataSource.createQueryBuilder(
        UserToGroup,
        'user_to_group',
      )
        .leftJoinAndSelect('user_to_group.user', 'user')
        .where('user_to_group.groupId = :id', { id })
        .getMany();

      return new PageDto('OK', HttpStatus.OK, result);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  public async removeMember(
    removeMemberDto: RemoveMemberDto,
    jwtUser: JwtUser,
  ): Promise<PageDto<UserToGroup>> {
    const { sub } = jwtUser;

    if (!(await this.isAdmin(sub.toString(), removeMemberDto.groupId))) {
      throw new UnauthorizedException(
        "You don't have permission to remove new member.",
      );
    }

    try {
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(UserToGroup)
        .where('userId = :userId and groupId = :groupId', {
          ...removeMemberDto,
        })
        .execute();

      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
