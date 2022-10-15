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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PageDto, PageOptionsDto } from 'src/dtos';
import { Menu } from 'src/entities/Menu';
import { MenuService } from './menu.service';
import { ApiPaginatedResponse } from 'src/decorators/api-paginated-response.decorator';

@ApiTags('Menu')
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
  ): Promise<PageDto<Menu>> {
    return this._menuService.getAllMenues(pageOptionsDto);
  }
}
