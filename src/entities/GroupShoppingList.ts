import { Group } from './Group';
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
import { User } from './User';

// REFACTOR
@Entity()
export class GroupShoppingList {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: string;

  @Column()
  @IsString()
  date: string;

  @ManyToOne(() => Group, (group) => group.groupShoppingLists)
  group: Group;

  @OneToOne(() => ShoppingList)
  @JoinColumn()
  shoppingList: ShoppingList;

  @OneToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  marketer: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
