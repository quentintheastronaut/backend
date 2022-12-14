import { AddMemberDto } from './dto/request/addMember.dto';
import { UserToGroup } from './../../../entities/UserToGroup';
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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageDto, PageOptionsDto } from 'src/dtos';
import { Group } from 'src/entities/Group';
import { GroupDto } from './dto/request/group.dto';
import { ApiPaginatedResponse } from 'src/decorators';
import { JwtGuard } from '../auth/guard';
import { JwtUser } from '../auth/dto/parsedToken.dto';
import { RemoveMemberDto } from './dto/request/removeMember.dto';

@ApiTags('Group')
@ApiBearerAuth()
@Controller('group')
export class GroupController {
  constructor(private readonly _groupService: GroupService) {}

  @ApiOperation({ summary: 'Get all groups of a user' })
  @UseGuards(JwtGuard)
  @Get('/by-user')
  async getGroupByUserId(@Req() req: { user: JwtUser }) {
    const { user } = req;
    return this._groupService.getGroupByUserId(user);
  }

  @ApiOperation({ summary: 'Add new member' })
  @UseGuards(JwtGuard)
  @Post('add-member')
  async addMember(
    @Req() req: { user: JwtUser },
    @Body() addMemberDto: AddMemberDto,
  ): Promise<PageDto<Group>> {
    const { user } = req;
    return this._groupService.addMember(user, addMemberDto);
  }

  @ApiOperation({ summary: 'Create new group' })
  @UseGuards(JwtGuard)
  @Post()
  async createGroup(
    @Req() req: { user: JwtUser },
    @Body() groupDto: GroupDto,
  ): Promise<PageDto<Group>> {
    const { user } = req;
    return this._groupService.createGroup(groupDto, user);
  }

  @ApiOperation({ summary: 'Remove a member' })
  @UseGuards(JwtGuard)
  @Post('/remove-member')
  async removeDish(
    @Req() req: { user: JwtUser },
    @Body() removeMemberDto: RemoveMemberDto,
  ) {
    const { user } = req;
    return this._groupService.removeMember(removeMemberDto, user);
  }

  @ApiOperation({ summary: "Update group's info" })
  @Patch(':id')
  async updateGroup(
    @Param('id') id: number,
    @Body() groupDto: GroupDto,
  ): Promise<PageDto<Group>> {
    return this._groupService.updateGroup(id, groupDto);
  }

  @ApiOperation({ summary: 'Delete group' })
  @Delete(':id')
  async deleteGroup(@Param('id') id: number): Promise<PageDto<Group>> {
    return this._groupService.deleteGroup(id);
  }

  @ApiOperation({ summary: 'Get all groups' })
  @Get()
  @ApiPaginatedResponse(Group)
  async getAllGroups(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Group[]>> {
    return this._groupService.getAllGroups(pageOptionsDto);
  }

  @ApiOperation({ summary: "Get group's detail" })
  @Get(':id')
  async getGroupDetail(@Param('id') id: string): Promise<PageDto<Group>> {
    return this._groupService.getGroupDetail(id);
  }

  @ApiOperation({ summary: "Get group's member" })
  @Get('/member/:id')
  async getAllMembers(
    @Param('id') id: string,
  ): Promise<PageDto<UserToGroup[]>> {
    return this._groupService.getAllMembers(id);
  }
}
