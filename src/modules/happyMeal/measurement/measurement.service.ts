import { MeasurementDto } from './dto/request/measurement.dto';
import { AppDataSource } from 'src/data-source';
import { Measurement } from './../../../entities/Measurement';
import { PageDto, PageOptionsDto, PageMetaDto } from 'src/dtos';
import {
  Injectable,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

@Injectable({})
export class MeasurementService {
  public async find(id: string) {
    try {
      return await AppDataSource.getRepository(Measurement).findOne({
        where: { id },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }

  public async getAllMeasurement(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Measurement[]>> {
    try {
      const queryBuilder = AppDataSource.createQueryBuilder();

      queryBuilder
        .select('measurement')
        .from(Measurement, 'measurement')
        .where('measurement.name like :name', {
          name: `%${pageOptionsDto.search}%`,
        })
        .orderBy('measurement.name', pageOptionsDto.order)
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.limit);

      const itemCount = await queryBuilder.getCount();
      const { entities } = await queryBuilder.getRawAndEntities();

      const pageMetaDto = new PageMetaDto({ total: itemCount, pageOptionsDto });

      return new PageDto('OK', HttpStatus.OK, entities, pageMetaDto);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  public async createMeasurement(
    measurementDto: MeasurementDto,
  ): Promise<PageDto<Measurement>> {
    try {
      await AppDataSource.createQueryBuilder()
        .insert()
        .into(Measurement)
        .values([measurementDto])
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async updateMeasurement(
    id: number,
    measurementDto: MeasurementDto,
  ): Promise<PageDto<Measurement>> {
    const measurement = await AppDataSource.getRepository(Measurement).findOne({
      where: {
        id: id.toString(),
      },
    });

    if (!measurement) {
      throw new NotFoundException('Not found');
    }
    try {
      await AppDataSource.createQueryBuilder()
        .update(Measurement)
        .set(measurementDto)
        .where('id = :id', { id })
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async deleteMeasurement(id: number): Promise<PageDto<Measurement>> {
    const measurement = await AppDataSource.getRepository(Measurement).findOne({
      where: {
        id: id.toString(),
      },
    });

    if (!measurement) {
      throw new NotFoundException('Not found');
    }
    try {
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(Measurement)
        .where('id = :id', { id })
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
