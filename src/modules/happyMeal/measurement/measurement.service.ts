import { MeasurementDto } from './dto/request/measurement.dto';
import { AppDataSource } from 'src/data-source';
import { Measurement } from './../../../entities/Measurement';
import { PageDto, PageOptionsDto } from 'src/dtos';
import {
  Injectable,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

@Injectable({})
export class MeasurementService {
  public async getAllMeasurement(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Measurement[]>> {
    try {
      const { entities } = await AppDataSource.createQueryBuilder()
        .select('measurement')
        .from(Measurement, 'measurement')
        .where('dish.name like :name', {
          name: `%${pageOptionsDto.search}%`,
        })
        .getRawAndEntities();
      return new PageDto('OK', HttpStatus.OK, entities);
    } catch (error) {}
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
