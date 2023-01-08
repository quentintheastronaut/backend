import { CheckDto } from './../modules/happyMeal/shoppingList/dto/request/check.dto';
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

  private fromDate: string;
  private toDate: string;
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
    const { fromDate, toDate, groupId } = payload;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.groupId = groupId;
    const groupShoppingList =
      await this._shoppingListService.getGroupShoppingListByRange(
        fromDate,
        toDate,
        groupId,
      );
    this.server.emit('get-group-shopping-list', groupShoppingList);
    this.logger.log('Emit event: get-group-shopping-list');
  }

  @SubscribeMessage('add-ingredient')
  async handleAddIngredient(
    client: Socket,
    @MessageBody() payload: AddGroupIngredientDto,
  ) {
    this.logger.log('On event: add-ingredient');
    await this._shoppingListService.addGroupIngredient(payload);
    const groupShoppingList =
      await this._shoppingListService.getGroupShoppingListByRange(
        this.fromDate,
        this.toDate,
        this.groupId,
      );
    this.server.emit('get-group-shopping-list', groupShoppingList);
    this.logger.log('Emit event: get-group-shopping-list');
  }

  @SubscribeMessage('remove-ingredient')
  async handleRemoveIngredient(
    client: Socket,
    @MessageBody() payload: RemoveIngredientDto,
  ) {
    this.logger.log('On event: remove-ingredient');
    await this._shoppingListService.removeIngredient(payload);
    const groupShoppingList =
      await this._shoppingListService.getGroupShoppingListByRange(
        this.fromDate,
        this.toDate,
        this.groupId,
      );
    this.server.emit('get-group-shopping-list', groupShoppingList);
    this.logger.log('Emit event: get-group-shopping-list');
  }

  @SubscribeMessage('update-ingredient')
  async handleUpdateIngredient(
    client: Socket,
    @MessageBody() payload: UpdateIngredientToShoppingListDto,
  ) {
    this.logger.log('On event: update-ingredient');
    await this._shoppingListService.updateIngredient(payload);
    const groupShoppingList =
      await this._shoppingListService.getGroupShoppingListByRange(
        this.fromDate,
        this.toDate,
        this.groupId,
      );
    this.server.emit('get-group-shopping-list', groupShoppingList);
    this.logger.log('Emit event: get-group-shopping-list');
  }

  @SubscribeMessage('check-ingredient')
  async handleCheck(client: Socket, @MessageBody() payload: CheckDto) {
    this.logger.log('On event: check-ingredient');
    await this._shoppingListService.check(payload);
    const groupShoppingList =
      await this._shoppingListService.getGroupShoppingListByRange(
        this.fromDate,
        this.toDate,
        this.groupId,
      );
    this.server.emit('get-group-shopping-list', groupShoppingList);
    this.logger.log('Emit event: get-group-shopping-list');
  }

  @SubscribeMessage('uncheck-ingredient')
  async handleUncheck(client: Socket, @MessageBody() payload: CheckDto) {
    this.logger.log('On event: uncheck-ingredient');
    await this._shoppingListService.uncheck(payload);
    const groupShoppingList =
      await this._shoppingListService.getGroupShoppingListByRange(
        this.fromDate,
        this.toDate,
        this.groupId,
      );
    this.server.emit('get-group-shopping-list', groupShoppingList);
    this.logger.log('Emit event: get-group-shopping-list');
  }
}
