import { AddGroupDishDto } from './dto/request/addGroupDish';
import { TrackDto } from './dto/request/track.dto';
import { UpdateDishToMenuDto } from './dto/request/updateDishToMenu.dto';
import { RemoveDishDto } from './dto/request/removeDish.dto';
import { MenuDto } from './dto/request/menu.dto';
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
import { Menu } from 'src/entities/Menu';
import { MenuService } from './menu.service';
import { ApiPaginatedResponse } from 'src/decorators/api-paginated-response.decorator';
import { JwtGuard } from '../auth/guard';
import { JwtUser } from '../auth/dto/parsedToken.dto';
import { AddDishDto } from './dto/request/addDish.dto';

@ApiTags('Menu')
@ApiBearerAuth()
@Controller('menu')
export class MenuController {
  constructor(private readonly _menuService: MenuService) {}

  @ApiOperation({ summary: 'Get list of menus' })
  @Get()
  @ApiPaginatedResponse(Menu)
  async getAllMenues(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Menu[]>> {
    return this._menuService.getAllMenues(pageOptionsDto);
  }

  @ApiOperation({ summary: 'Update a dish in the menu' })
  @Patch('/update-dish')
  async updateDish(@Body() updateDishDto: UpdateDishToMenuDto) {
    return this._menuService.updateMenuDetail(updateDishDto);
  }

  @ApiOperation({ summary: 'Delete menu' })
  @Delete(':id')
  async deleteMenu(@Param('id') id: number): Promise<PageDto<Menu>> {
    return this._menuService.deleteMenu(id);
  }

  @ApiOperation({ summary: 'Add dish into menu' })
  @UseGuards(JwtGuard)
  @Post('/group/add-dish')
  async addGroupDish(@Body() addGroupDishDto: AddGroupDishDto) {
    return this._menuService.addGroupDish(addGroupDishDto);
  }

  @ApiOperation({ summary: 'Add dish into menu' })
  @UseGuards(JwtGuard)
  @Post('/add-dish')
  async addDish(@Req() req: { user: JwtUser }, @Body() addDishDto: AddDishDto) {
    const { user } = req;
    return this._menuService.addDish(addDishDto, user);
  }

  @ApiOperation({ summary: 'Menu recommendation' })
  @UseGuards(JwtGuard)
  @Post('/recommend')
  async recommend(@Req() req: { user: JwtUser }, @Query('date') date: string) {
    const { user } = req;
    return this._menuService.recommendByRecombee(user, date);
  }

  @ApiOperation({ summary: 'Remove dish into menu' })
  @UseGuards(JwtGuard)
  @Post('/remove-dish')
  async removeDish(
    @Req() req: { user: JwtUser },
    @Body() removeDishDto: RemoveDishDto,
  ) {
    const { user } = req;
    return this._menuService.removeDish(removeDishDto, user);
  }

  @UseGuards(JwtGuard)
  @Get('/group')
  @ApiOperation({ summary: 'Get detail menu by date' })
  async getGroupMenuByDate(
    @Query('date') date: string,
    @Query('groupId') groupId: string,
  ) {
    return this._menuService.getGroupMenuByDate(date, groupId);
  }

  @UseGuards(JwtGuard)
  @Get('/:date')
  @ApiOperation({ summary: 'Get detail menu by date' })
  async getMenuByDate(
    @Param('date') date: string,
    @Req() req: { user: JwtUser },
  ) {
    const { user } = req;
    return this._menuService.getMenuByDate(date, user);
  }

  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Track a dish in the menu' })
  @Post('/track')
  async track(@Body() trackDto: TrackDto, @Req() req: { user: JwtUser }) {
    const { user } = req;
    return this._menuService.track(trackDto, user);
  }

  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Untrack a dish in the menu' })
  @Post('/untrack')
  async untrack(@Body() trackDto: TrackDto, @Req() req: { user: JwtUser }) {
    const { user } = req;
    return this._menuService.untrack(trackDto, user);
  }
}
