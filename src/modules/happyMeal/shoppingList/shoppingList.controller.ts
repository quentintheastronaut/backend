import { AssignMarketerDto } from './dto/request/assignMarketer.dto';
import { AddGroupIngredientDto } from './dto/request/addGroupIngredient';
import { CheckDto } from './dto/request/check.dto';
import { RemoveIngredientDto } from './dto/request/removeIngredient.dto';
import { UpdateIngredientToShoppingListDto } from './dto/request/updateIngredientToShoppingList.dto';
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
  @Get('/by-user')
  async getShoppingListByUser(@Req() req: { user: JwtUser }) {
    const { user } = req;
    return this._shoppingListService.getShoppingListByUser(user);
  }

  @UseGuards(JwtGuard)
  @Get('/by-group')
  async getShoppingListByGroup(@Req() req: { user: JwtUser }) {
    const { user } = req;
    return this._shoppingListService.getShoppingListByGroup(user);
  }

  @Get('/detail')
  @ApiOperation({ summary: "Get group's detail shopping list by date" })
  async getShoppingListDetail(
    @Query('date') date: string,
    @Query('groupId') groupId: string,
  ) {
    const assignMarketerDto: AssignMarketerDto = {
      date,
      groupId,
    };
    return this._shoppingListService.getShoppingListDetail(assignMarketerDto);
  }

  @UseGuards(JwtGuard)
  @ApiOperation({ summary: `Assign to be group\'s marketer ` })
  @Post('/assign-marketer')
  async assignMarketer(
    @Req() req: { user: JwtUser },
    @Body() assignMarketerDto: AssignMarketerDto,
  ) {
    const { user } = req;
    return this._shoppingListService.assignMarketer(user, assignMarketerDto);
  }

  @UseGuards(JwtGuard)
  @ApiOperation({ summary: `Cancel assign to be group\'s marketer ` })
  @Post('/unassign-marketer')
  async unassignMarketer(@Body() assignMarketerDto: AssignMarketerDto) {
    return this._shoppingListService.unassignMarketer(assignMarketerDto);
  }

  @Get('/group')
  @ApiOperation({ summary: "Get group's detail shopping list by date" })
  async getGroupShoppingListByDate(
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
    @Query('groupId') groupId: string,
  ) {
    return this._shoppingListService.getGroupShoppingListByRange(
      fromDate,
      toDate,
      groupId,
    );
  }

  @UseGuards(JwtGuard)
  @Get('/individual')
  @ApiOperation({ summary: 'Get detail shopping list by date' })
  async getShoppingListByDate(
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
    @Req() req: { user: JwtUser },
  ) {
    const { user } = req;
    return this._shoppingListService.getShoppingListByRange(
      fromDate,
      toDate,
      user,
    );
  }

  @ApiOperation({ summary: "Add group's ingredient into shopping list" })
  @UseGuards(JwtGuard)
  @Post('/group/add-ingredient')
  async addGroupIngredient(
    @Body() addGroupIngredientDto: AddGroupIngredientDto,
  ) {
    return this._shoppingListService.addGroupIngredient(addGroupIngredientDto);
  }

  @ApiOperation({ summary: 'Add ingredient into shopping list' })
  @UseGuards(JwtGuard)
  @Post('/add-ingredient')
  async addIngredient(
    @Req() req: { user: JwtUser },
    @Body() addIngredientDto: AddIngredientDto,
  ) {
    const { user } = req;
    return this._shoppingListService.addIngredient(addIngredientDto, user);
  }

  @ApiOperation({ summary: 'Update a ingredient in the shopping list' })
  @Patch('/update-ingredient')
  async updateDish(
    @Body()
    updateIngredientToShoppingListDto: UpdateIngredientToShoppingListDto,
  ) {
    return this._shoppingListService.updateIngredient(
      updateIngredientToShoppingListDto,
    );
  }

  @ApiOperation({ summary: 'Remove dish into menu' })
  @UseGuards(JwtGuard)
  @Post('/remove-ingredient')
  async removeDish(@Body() removeIngredientDto: RemoveIngredientDto) {
    return this._shoppingListService.removeIngredient(removeIngredientDto);
  }

  @ApiOperation({ summary: 'Check a ingredient in the shopping list' })
  @Post('/check')
  async track(@Body() checkDto: CheckDto) {
    return this._shoppingListService.check(checkDto);
  }

  @ApiOperation({ summary: 'Check a ingredient in the shopping list' })
  @Post('/uncheck')
  async uncheck(@Body() checkDto: CheckDto) {
    return this._shoppingListService.uncheck(checkDto);
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
