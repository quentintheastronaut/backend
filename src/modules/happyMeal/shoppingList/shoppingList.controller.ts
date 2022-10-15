import { ShoppingListService } from './shoppingList.service';
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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PageDto, PageOptionsDto } from 'src/dtos';
import { ShoppingList } from 'src/entities/ShoppingList';
import { ShoppingListDto } from './dto/request/shoppingList.dto';
import { ApiPaginatedResponse } from 'src/decorators';

@ApiTags('ShoppingList')
@ApiBearerAuth()
@Controller('shoppingList')
export class ShoppingListController {
  constructor(private readonly _shoppingListService: ShoppingListService) {}

  @Patch(':id')
  async updateShoppingList(
    @Param('id') id: number,
    @Body() shoppingListDto: ShoppingListDto,
  ): Promise<PageDto<ShoppingList>> {
    return this._shoppingListService.updateShoppingList(id, shoppingListDto);
  }

  @Post()
  async createShoppingList(
    @Body() shoppingListDto: ShoppingListDto,
  ): Promise<PageDto<ShoppingList>> {
    return this._shoppingListService.createShoppingList(shoppingListDto);
  }

  @Delete(':id')
  async deleteShoppingList(
    @Param('id') id: number,
  ): Promise<PageDto<ShoppingList>> {
    return this._shoppingListService.deleteShoppingList(id);
  }

  @Get()
  @ApiPaginatedResponse(ShoppingList)
  async getAllShoppingLists(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ShoppingList>> {
    return this._shoppingListService.getAllShoppingList(pageOptionsDto);
  }
}
