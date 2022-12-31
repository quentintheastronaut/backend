import { Server, Socket } from 'socket.io';
import { MenuService } from '../modules/happyMeal/menu/menu.service';
import { Inject, forwardRef, Logger } from '@nestjs/common';
import { MessageBody, WebSocketServer } from '@nestjs/websockets';
import {
  OnGatewayDisconnect,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayInit,
} from '@nestjs/websockets';
import { SubscribeMessage } from '@nestjs/websockets';
import { AddGroupDishDto } from 'src/modules/happyMeal/menu/dto/request/addGroupDish';
import { RemoveDishDto } from 'src/modules/happyMeal/menu/dto/request/removeDish.dto';
import { UpdateDishToMenuDto } from 'src/modules/happyMeal/menu/dto/request/updateDishToMenu.dto';

@WebSocketGateway({ cors: true })
export class MenuGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(forwardRef(() => MenuService))
    private _menuService: MenuService,
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
  @SubscribeMessage('get-group-menu')
  async handleGetGroupMenu(client: Socket, @MessageBody() payload: any) {
    const { date, groupId } = payload;
    this.date = date;
    this.groupId = groupId;
    const groupMenu = await this._menuService.getGroupMenuByDate(date, groupId);
    this.server.emit('get-group-menu', groupMenu);
  }

  @SubscribeMessage('add-dish')
  async handleAddDish(client: Socket, @MessageBody() payload: AddGroupDishDto) {
    await this._menuService.addGroupDish(payload);
    const groupShoppingList = await this._menuService.getGroupMenuByDate(
      this.date,
      this.groupId,
    );
    this.server.emit('get-group-menu', groupShoppingList);
  }

  @SubscribeMessage('remove-dish')
  async handleRemoveDish(
    client: Socket,
    @MessageBody() payload: RemoveDishDto,
  ) {
    await this._menuService.removeDish(payload);
    const groupShoppingList = await this._menuService.getGroupMenuByDate(
      this.date,
      this.groupId,
    );
    this.server.emit('get-group-menu', groupShoppingList);
  }

  @SubscribeMessage('update-dish')
  async handleUpdateDish(
    client: Socket,
    @MessageBody() payload: UpdateDishToMenuDto,
  ) {
    await this._menuService.updateMenuDetail(payload);
    const groupShoppingList = await this._menuService.getGroupMenuByDate(
      this.date,
      this.groupId,
    );
    this.server.emit('get-group-menu', groupShoppingList);
  }
}
