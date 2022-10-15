import { MenuDto } from './dto/request/menu.dto';
import { AppDataSource } from './../../../data-source';
import { PageOptionsDto } from './../../../dtos/pageOption.dto';
import {
  Injectable,
  InternalServerErrorException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { PageDto } from 'src/dtos/page.dto';
import { PageMetaDto } from 'src/dtos/pageMeta.dto';
import { Menu } from 'src/entities/Menu';

@Injectable({})
export class MenuService {
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
  ): Promise<PageDto<Menu>> {
    const queryBuilder = AppDataSource.createQueryBuilder();

    queryBuilder
      .select('menu')
      .from(Menu, 'menu')
      .where('menu.name like :name', {
        name: `%${pageOptionsDto.search}%`,
      })
      .orderBy('menu.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ total: itemCount, pageOptionsDto });

    return new PageDto('OK', HttpStatus.OK, entities, pageMetaDto);
  }
}
