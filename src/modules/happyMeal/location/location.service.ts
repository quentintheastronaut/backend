import { InternalServerErrorException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/dtos';
import { Location } from 'src/entities/Location';
import { LocationDto } from './dto/request/location.dto';

@Injectable({})
export class LocationService {
  // COMMON SERVICE
  public async insert(locationDto: LocationDto) {
    try {
      return await AppDataSource.createQueryBuilder()
        .insert()
        .into(Location)
        .values([locationDto])
        .execute();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async delete(id: string) {
    try {
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(Location)
        .where('id = :id', { id })
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async update(id: string, locationDto: LocationDto) {
    try {
      await AppDataSource.createQueryBuilder()
        .update(Location)
        .set(locationDto)
        .where('id = :id', { id })
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // CONTROLLER SERVICE
  public async createLocation(locationDto: LocationDto): Promise<PageDto<any>> {
    try {
      const result = await this.insert(locationDto);
      return new PageDto('OK', HttpStatus.OK, {
        insertedId: result.raw.insertId,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  public async getAllLocations(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Location[]>> {
    const queryBuilder = AppDataSource.createQueryBuilder()
      .select('location')
      .from(Location, 'location')
      .where('location.name like :name', {
        name: `%${pageOptionsDto.search}%`,
      })
      .orderBy('location.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ total: itemCount, pageOptionsDto });

    return new PageDto('OK', HttpStatus.OK, entities, pageMetaDto);
  }

  public async updateLocation(id: string, locationDto: LocationDto) {
    try {
      await this.update(id, locationDto);
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  public async removeLocation(id: string) {
    try {
      await this.delete(id);
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
