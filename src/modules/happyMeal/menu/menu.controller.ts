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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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

  @Patch(':id')
  async updateMenu(
    @Param('id') id: number,
    @Body() menuDto: MenuDto,
  ): Promise<PageDto<Menu>> {
    return this._menuService.updateMenu(id, menuDto);
  }

  @Post()
  async createMenu(@Body() menuDto: MenuDto): Promise<PageDto<Menu>> {
    return this._menuService.createMenu(menuDto);
  }

  @Delete(':id')
  async deleteMenu(@Param('id') id: number): Promise<PageDto<Menu>> {
    return this._menuService.deleteMenu(id);
  }

  @Get()
  @ApiPaginatedResponse(Menu)
  async getAllMenues(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Menu[]>> {
    return this._menuService.getAllMenues(pageOptionsDto);
  }

  @UseGuards(JwtGuard)
  @Post('/add-dish')
  async addDish(@Req() req: { user: JwtUser }, @Body() addDishDto: AddDishDto) {
    const { user } = req;
    return this._menuService.addDish(addDishDto, user);
  }

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
  @Get('/:date')
  async getMenuByDate(
    @Param('date') date: string,
    @Req() req: { user: JwtUser },
  ) {
    const { user } = req;
    return this._menuService.getMenuByDate(date, user);
  }

  @Post('/update-dish')
  async updateDish(@Body() updateDishDto: UpdateDishToMenuDto) {
    return this._menuService.updateMenuDetail(updateDishDto);
  }
}
