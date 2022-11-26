import { MeasurementDto } from './dto/request/measurement.dto';
import { PageDto } from 'src/dtos';
import { Measurement } from './../../../entities/Measurement';
import { MeasurementService } from './measurement.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiPaginatedResponse } from 'src/decorators';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Measurement')
@Controller('measurement')
export class MeasurementController {
  constructor(private readonly _measurementService: MeasurementService) {}

  @Post()
  async createDish(
    @Body() measurementDto: MeasurementDto,
  ): Promise<PageDto<Measurement>> {
    return this._measurementService.createMeasurement(measurementDto);
  }

  @Get()
  @ApiPaginatedResponse(Measurement)
  async getAllDishes(): Promise<PageDto<Measurement[]>> {
    return this._measurementService.getAllMeasurement();
  }

  @Patch(':id')
  async updateDish(
    @Param('id') id: number,
    @Body() measurementDto: MeasurementDto,
  ): Promise<PageDto<Measurement>> {
    return this._measurementService.updateMeasurement(id, measurementDto);
  }

  @Delete(':id')
  async deleteDish(@Param('id') id: number): Promise<PageDto<Measurement>> {
    return this._measurementService.deleteMeasurement(id);
  }
}
