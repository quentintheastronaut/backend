import { Group } from './Group';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ShoppingList } from './ShoppingList';

@Entity()
export class GroupShoppingList {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: string;

  @ManyToOne(() => Group, (group) => group.groupMenus)
  group: Group;

  @OneToOne(() => ShoppingList)
  @JoinColumn()
  shoppingList: ShoppingList;
}
