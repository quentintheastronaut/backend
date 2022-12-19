import { GetWeightRecordsDto } from './dto/request/getWeightRecord';
import { WeightRecord } from './../../../entities/WeightRecord';
import { PageDto } from 'src/dtos';
import { User } from 'src/entities';
import { AppDataSource } from 'src/data-source';
import { JwtUser } from './../auth/dto/parsedToken.dto';
import {
  Injectable,
  HttpStatus,
  InternalServerErrorException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { UpdateWeightDto } from './dto/request/updateWeight.dto';
import * as moment from 'moment';
import { DateFormat } from 'src/constants/dateFormat';
import { UserService } from '../user/user.service';

@Injectable({})
export class WeightRecordService {
  constructor(
    @Inject(forwardRef(() => UserService)) private _userService: UserService,
  ) {}

  public async updateWeight(
    jwtUser: JwtUser,
    updateWeightDto: UpdateWeightDto,
  ) {
    try {
      const { sub } = jwtUser;
      const user = await this._userService.findByAccountId(sub.toString());
      await AppDataSource.createQueryBuilder()
        .update(User)
        .set(updateWeightDto)
        .where('id = :id', { id: user.id })
        .execute();

      await AppDataSource.createQueryBuilder()
        .insert()
        .into(WeightRecord)
        .values([
          {
            user: {
              id: user.id,
            },
            value: updateWeightDto.weight,
          },
        ])
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  public async getWeightRecords(
    jwtUser: JwtUser,
    getWeightRecordsDto: GetWeightRecordsDto,
  ) {
    try {
      const { startDate, endDate } = getWeightRecordsDto;
      const result = await AppDataSource.createQueryBuilder(
        WeightRecord,
        'weight_record',
      )
        .where(
          'userId = :userId AND createdAt >= :startDate AND createdAt <= :endDate',
          {
            startDate: moment(startDate, DateFormat.FULL_DATE)
              .clone()
              .startOf('day')
              .toISOString(),
            endDate: moment(endDate, DateFormat.FULL_DATE)
              .clone()
              .endOf('day')
              .toISOString(),
            userId: jwtUser.sub.toString(),
          },
        )
        .getMany();

      return new PageDto('OK', HttpStatus.OK, result);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
