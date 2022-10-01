import { GroupService } from './group.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PageDto, PageOptionsDto } from 'src/dtos';
import { Group } from 'src/enitities/Group';
import { GroupDto } from './dto/request/group.dto';
import { ApiPaginatedResponse } from 'src/decorators';
import { JwtGuard } from '../auth/guard';
import { JwtUser } from '../auth/dto/parsedToken.dto';

@ApiTags('Group')
@ApiBearerAuth()
@Controller('group')
export class GroupController {
  constructor(private readonly _groupService: GroupService) {}

  @Patch(':id')
  async updateGroup(
    @Param('id') id: number,
    @Body() groupDto: GroupDto,
  ): Promise<PageDto<Group>> {
    return this._groupService.updateGroup(id, groupDto);
  }

  @UseGuards(JwtGuard)
  @Post()
  async createGroup(
    @Req() req: { user: JwtUser },
    @Body() groupDto: GroupDto,
  ): Promise<PageDto<Group>> {
    const { user } = req;
    return this._groupService.createGroup(groupDto, user);
  }

  @Delete(':id')
  async deleteGroup(@Param('id') id: number): Promise<PageDto<Group>> {
    return this._groupService.deleteGroup(id);
  }

  @Get()
  @ApiPaginatedResponse(Group)
  async getAllGroups(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Group>> {
    return this._groupService.getAllGroups(pageOptionsDto);
  }
}
