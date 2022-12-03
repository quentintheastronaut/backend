import { GetMenuByDateDto } from './../menu/dto/request/getMenuByDate.dto';
import { GetWeightRecordsDto } from './dto/request/getWeightRecord';
import { JwtUser } from './../auth/dto/parsedToken.dto';
import { JwtGuard } from './../auth/guard/jwt.guard';
import { WeightRecordService } from './weightRecord.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateWeightDto } from './dto/request/updateWeight.dto';

@ApiTags('Weight Record')
@ApiBearerAuth()
@Controller('weight-record')
export class WeightRecordController {
  constructor(private _weightRecordService: WeightRecordService) {}

  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get weight records' })
  @Get()
  async getWeightRecords(
    @Req() req: { user: JwtUser },
    @Query() getWeightRecordsDto: GetWeightRecordsDto,
  ) {
    const { user } = req;
    return this._weightRecordService.getWeightRecords(
      user,
      getWeightRecordsDto,
    );
  }

  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Update weight' })
  @Patch('/')
  async updateProfile(
    @Req() req: { user: JwtUser },
    @Body() updateWeightDto: UpdateWeightDto,
  ) {
    const { user } = req;
    return this._weightRecordService.updateWeight(user, updateWeightDto);
  }
}
