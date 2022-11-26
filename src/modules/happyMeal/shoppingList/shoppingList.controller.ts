import { AddIngredientDto } from './dto/request/addIngredient.dto';
import { JwtUser } from './../auth/dto/parsedToken.dto';
import { JwtGuard } from './../auth/guard/jwt.guard';
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
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageDto, PageOptionsDto } from 'src/dtos';
import { ShoppingList } from 'src/entities/ShoppingList';
import { ShoppingListDto } from './dto/request/shoppingList.dto';
import { ApiPaginatedResponse } from 'src/decorators';

@ApiTags('ShoppingList')
@ApiBearerAuth()
@Controller('shoppingList')
export class ShoppingListController {
  constructor(private readonly _shoppingListService: ShoppingListService) {}

  @UseGuards(JwtGuard)
  @Get('/:date')
  @ApiOperation({ summary: 'Get detail shopping list by date' })
  async getMenuByDate(
    @Param('date') date: string,
    @Req() req: { user: JwtUser },
  ) {
    const { user } = req;
    return this._shoppingListService.getShoppingListByDate(date, user);
  }

  @ApiOperation({ summary: 'Add ingredient into shopping list' })
  @UseGuards(JwtGuard)
  @Post('/add-ingredient')
  async addDish(
    @Req() req: { user: JwtUser },
    @Body() addIngredientDto: AddIngredientDto,
  ) {
    const { user } = req;
    return this._shoppingListService.addIngredient(addIngredientDto, user);
  }

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
  ): Promise<PageDto<ShoppingList[]>> {
    return this._shoppingListService.getAllShoppingList(pageOptionsDto);
  }
}
