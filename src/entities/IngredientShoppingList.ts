import { ShoppingList } from './ShoppingList';
import { User } from './User';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class IndividualShoppingList {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: string;

  @ManyToOne(() => User, (user) => user.individualMenus)
  user: User;

  @OneToOne(() => ShoppingList)
  @JoinColumn()
  menu: ShoppingList;
}
