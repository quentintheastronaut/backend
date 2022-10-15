import { ShoppingListStatus } from './../constants/shoppingListStatus';
import { ShoppingListType } from '../constants/shoppingListType';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Ingredient } from './Ingredient';

@Entity()
export class ShoppingList {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: string;

  @Column()
  groupId: number;

  @Column()
  userId: number;

  @Column()
  marketTime: string;

  @Column({
    nullable: false,
  })
  type: ShoppingListType;

  @Column({
    nullable: false,
  })
  status: ShoppingListStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Ingredient)
  @JoinTable()
  ingredients: Ingredient[];
}
