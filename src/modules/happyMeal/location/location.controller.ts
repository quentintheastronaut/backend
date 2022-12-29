import { Location } from './../../../entities/Location';
import { LocationDto } from './dto/request/location.dto';
import { JwtGuard } from './../auth/guard/jwt.guard';
import { Controller, Get, Query, Req, Post, Body, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocationService } from './location.service';
import { UseGuards } from '@nestjs/common';
import { JwtUser } from '../auth/dto/parsedToken.dto';
import { PageDto, PageOptionsDto } from 'src/dtos';
import { ApiPaginatedResponse } from 'src/decorators';
import { Delete } from '@nestjs/common';
import { Param } from '@nestjs/common';

@ApiTags('Location')
@ApiBearerAuth()
@Controller('location')
export class LocationController {
  constructor(private _locationService: LocationService) {}

  @Post()
  @ApiOperation({ summary: 'Create' })
  async createIngredient(
    @Body() locationDto: LocationDto,
  ): Promise<PageDto<Location>> {
    return this._locationService.createLocation(locationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get' })
  @ApiPaginatedResponse(Location)
  async getAllIngredients(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Location[]>> {
    return this._locationService.getAllLocations(pageOptionsDto);
  }

  @ApiOperation({ summary: 'Update' })
  @Patch('/:id')
  async addIngredient(
    @Param('id') id: string,
    @Body() locationDto: LocationDto,
  ) {
    return this._locationService.updateLocation(id, locationDto);
  }

  @ApiOperation({ summary: 'Delete' })
  @Delete(':id')
  async removeIngredient(@Param('id') id: string) {
    return this._locationService.removeLocation(id);
  }
}
