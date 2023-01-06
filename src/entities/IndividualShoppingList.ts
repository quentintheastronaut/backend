import { User } from './User';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ShoppingList } from './ShoppingList';
import { IsString } from 'class-validator';

// REFACTOR
@Entity()
export class IndividualShoppingList {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: string;

  @Column()
  @IsString()
  date: string;

  @ManyToOne(() => User, (user) => user.individualShoppingLists)
  user: User;

  @OneToOne(() => ShoppingList)
  @JoinColumn()
  shoppingList: ShoppingList;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
