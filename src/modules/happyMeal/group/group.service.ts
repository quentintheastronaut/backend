import { UserToGroup } from '../../../entities/UserToGroup';
import { JwtUser } from './../auth/dto/parsedToken.dto';
import { AppDataSource } from './../../../data-source';
import {
  Injectable,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Group } from 'src/entities/Group';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/dtos';
import { GroupDto } from './dto/request/group.dto';
import { User } from 'src/entities';
import { GroupRole } from 'src/constants/groupRole';

@Injectable({})
export class GroupService {
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

    const { email } = jwtUser;
    const user = await AppDataSource.getRepository(User).findOne({
      where: {
        email,
      },
    });

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
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async deleteGroup(id: number): Promise<PageDto<Group>> {
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
        .delete()
        .from(Group)
        .where('id = :id', { id })
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async getAllGroups(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Group>> {
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
}
