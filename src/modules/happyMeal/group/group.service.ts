import { NotificationsService } from './../../../services/notifications/notifications.service';
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
import { ShoppingListService } from '../shoppingList/shoppingList.service';
import { MenuService } from '../menu/menu.service';
import { GroupShoppingList } from 'src/entities/GroupShoppingList';
import { GroupMenu } from 'src/entities/GroupMenu';
import { parseGroupTopic } from 'src/utils/parseGroupTopic';

@Injectable({})
export class GroupService {
  constructor(
    @Inject(forwardRef(() => UserService)) private _userService: UserService,
    @Inject(forwardRef(() => ShoppingListService))
    private _shoppingListService: ShoppingListService,
    @Inject(forwardRef(() => MenuService))
    private _menuService: MenuService,
    @Inject(forwardRef(() => AuthService)) private _authService: AuthService,
    @Inject(forwardRef(() => NotificationsService))
    private _notificationsService: NotificationsService,
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
          group: true,
        },
        where: {
          user: {
            id: user?.id,
          },
        },
      });

      if (!userToGroup) return null;

      return await AppDataSource.getRepository(Group).findOne({
        where: {
          id: userToGroup?.groupId,
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
    const account = await this._authService.findOneById(sub.toString());
    const user = await this._userService.findByAccountId(sub.toString());

    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      const newGroup = await AppDataSource.createQueryBuilder()
        .insert()
        .into(Group)
        .values([groupDto])
        .execute();

      await this._notificationsService.subscribeTopic(
        account.token,
        parseGroupTopic(newGroup.raw.insertId.toString()),
      );
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
      const groupShoppingLists = await AppDataSource.getRepository(
        GroupShoppingList,
      ).find({
        relations: {
          group: true,
          shoppingList: true,
        },
        where: {
          group: {
            id: group.id,
          },
        },
      });

      const groupMenus = await AppDataSource.getRepository(GroupMenu).find({
        relations: {
          group: true,
          menu: true,
        },
        where: {
          group: {
            id: group.id,
          },
        },
      });

      if (groupMenus) {
        groupMenus.forEach(async (groupMenu) => {
          await AppDataSource.createQueryBuilder()
            .delete()
            .from(GroupMenu)
            .where('menuId = :id', { id: groupMenu.menu.id })
            .execute();

          await AppDataSource.createQueryBuilder()
            .delete()
            .from(DishToMenu)
            .where('menuId = :id', { id: groupMenu.menu.id })
            .execute();
        });
      }

      if (groupShoppingLists) {
        groupShoppingLists.forEach(async (groupShoppingList) => {
          await AppDataSource.createQueryBuilder()
            .delete()
            .from(GroupShoppingList)
            .where('shoppingListId = :id', {
              id: groupShoppingList.shoppingList.id,
            })
            .execute();

          await AppDataSource.createQueryBuilder()
            .delete()
            .from(IngredientToShoppingList)
            .where('shoppingListId = :id', {
              id: groupShoppingList.shoppingList.id,
            })
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
      const user = await this._userService.findByAccountId(sub.toString());
      const result = await AppDataSource.createQueryBuilder(
        UserToGroup,
        'user_to_group',
      )
        .leftJoinAndSelect('user_to_group.group', 'group')
        .where('userId = :userId', { userId: user.id })
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
          user: {
            id: userId,
          },
          group: {
            id: groupId,
          },
        },
      });
      console.log(user);
      if (user) {
        return false;
      }
      return user && user.role == GroupRole.ADMIN;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  public async addMember(
    jwtUser: JwtUser,
    addMemberDto: AddMemberDto,
  ): Promise<PageDto<Group>> {
    try {
      const { sub } = jwtUser;
      const user = await this._userService.findByAccountId(sub.toString());

      if (!(await this.isAdmin(user.id, addMemberDto.groupId))) {
        throw new UnauthorizedException(
          "You don't have permission to add new member.",
        );
      }

      if (!(await this._authService.isExistedEmail(addMemberDto.email))) {
        throw new BadRequestException('This user is not existed !');
      }

      const newMemberAccount = await this._authService.findOneByEmail(
        addMemberDto.email,
      );

      const group = await this.find(addMemberDto.groupId);

      const newMember = await this._userService.findByAccountId(
        newMemberAccount.id,
      );

      if (await this.hasGroup(newMember.id)) {
        throw new BadRequestException(
          'This user is already in another group !',
        );
      }

      await AppDataSource.createQueryBuilder()
        .insert()
        .into(UserToGroup)
        .values({
          groupId: addMemberDto.groupId,
          userId: newMember.id,
          role: GroupRole.MEMBER,
        })
        .execute();

      console.log(newMemberAccount);

      if (newMemberAccount?.token) {
        await this._notificationsService.subscribeTopic(
          newMemberAccount.token,
          parseGroupTopic(addMemberDto.groupId),
        );

        await this._notificationsService.sendJoinGroupNotification(
          group.name,
          newMemberAccount.token,
        );
      }

      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
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
        .leftJoinAndSelect('user.account', 'account')
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

    console.log('sub', sub);
    console.log('removeMemberDto', removeMemberDto);

    const user = await this._userService.findByAccountId(sub.toString());

    console.log(user);

    if (!(await this.isAdmin(user.id, removeMemberDto.groupId))) {
      throw new UnauthorizedException(
        "You don't have permission to remove new member.",
      );
    }

    const member = await this._authService.findOneById(removeMemberDto.userId);

    const group = await this.find(removeMemberDto.groupId);

    try {
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(UserToGroup)
        .where('userId = :userId and groupId = :groupId', {
          ...removeMemberDto,
        })
        .execute();

      if (member?.token) {
        await this._notificationsService.unsubscribeTopic(
          member.token,
          parseGroupTopic(removeMemberDto.groupId),
        );

        await this._notificationsService.sendRemoveMemberNotification(
          group.name,
          member.token,
        );
      }

      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
