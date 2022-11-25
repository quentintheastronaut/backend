import { IngredientToShoppingList } from './IngredientToShoppingList';
import { ShoppingListStatus } from './../constants/shoppingListStatus';
import { ShoppingListType } from '../constants/shoppingListType';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Ingredient } from './Ingredient';
import { IsString } from 'class-validator';

@Entity()
export class ShoppingList {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: string;

  @Column({
    nullable: false,
  })
  @IsString()
  date: string;

  @Column()
  groupId: string;

  @Column()
  userId: string;

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

  @OneToMany(
    () => IngredientToShoppingList,
    (ingredientToShoppingList) => ingredientToShoppingList.shoppingList,
  )
  public ingredientsToShoppingList!: IngredientToShoppingList[];
}
