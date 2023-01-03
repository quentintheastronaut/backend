import { IngredientToShoppingList } from './../entities/IngredientToShoppingList';
import { AppDataSource } from 'src/data-source';
import { UpdateIngredientToShoppingListDto } from './../modules/happyMeal/shoppingList/dto/request/updateIngredientToShoppingList.dto';
import { RemoveIngredientDto } from './../modules/happyMeal/shoppingList/dto/request/removeIngredient.dto';
import { AddGroupIngredientDto } from './../modules/happyMeal/shoppingList/dto/request/addGroupIngredient';
import { ShoppingListService } from './../modules/happyMeal/shoppingList/shoppingList.service';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger, Inject, forwardRef } from '@nestjs/common';
import { OnGatewayInit } from '@nestjs/websockets';

@WebSocketGateway({ cors: true })
export class ShoppingListGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(forwardRef(() => ShoppingListService))
    private _shoppingListService: ShoppingListService,
  ) {}

  @WebSocketServer()
  private server: Server;
  private logger: Logger = new Logger('ShoppingListGateway');

  private date: string;
  private groupId: string;

  // Socket config
  afterInit(server: Server) {
    this.logger.log('Initialized!');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  // socket.on
  @SubscribeMessage('get-group-shopping-list')
  async handleGetGroupShoppingList(
    client: Socket,
    @MessageBody() payload: any,
  ) {
    const { shoppingListId } = payload;
    const groupShoppingList =
      await this._shoppingListService.getGroupShoppingListByDate(
        shoppingListId,
      );
    this.server.emit('get-group-shopping-list', groupShoppingList);
  }

  @SubscribeMessage('add-ingredient')
  async handleAddIngredient(
    client: Socket,
    @MessageBody() payload: AddGroupIngredientDto,
  ) {
    await this._shoppingListService.addGroupIngredient(payload);
    const groupShoppingList =
      await this._shoppingListService.getGroupShoppingListByDate(
        payload.groupShoppingListId,
      );
    this.server.emit('get-group-shopping-list', groupShoppingList);
  }

  @SubscribeMessage('remove-ingredient')
  async handleRemoveIngredient(
    client: Socket,
    @MessageBody() payload: RemoveIngredientDto,
  ) {
    const ingredientToShoppingList = await AppDataSource.getRepository(
      IngredientToShoppingList,
    ).findOne({
      relations: {
        ingredient: true,
        shoppingList: true,
      },
      where: {
        ingredientToShoppingListId: payload.ingredientToShoppingListId,
      },
    });
    await this._shoppingListService.removeIngredient(payload);
    const groupShoppingList =
      await this._shoppingListService.getGroupShoppingListByDate(
        ingredientToShoppingList.shoppingList.id,
      );
    this.server.emit('get-group-shopping-list', groupShoppingList);
  }

  @SubscribeMessage('update-ingredient')
  async handleUpdateIngredient(
    client: Socket,
    @MessageBody() payload: UpdateIngredientToShoppingListDto,
  ) {
    const ingredientToShoppingList = await AppDataSource.getRepository(
      IngredientToShoppingList,
    ).findOne({
      relations: {
        ingredient: true,
        shoppingList: true,
      },
      where: {
        ingredientToShoppingListId: payload.ingredientToShoppingListId,
      },
    });
    await this._shoppingListService.updateIngredient(payload);
    const groupShoppingList =
      await this._shoppingListService.getGroupShoppingListByDate(
        ingredientToShoppingList.shoppingList.id,
      );
    this.server.emit('get-group-shopping-list', groupShoppingList);
  }
}
