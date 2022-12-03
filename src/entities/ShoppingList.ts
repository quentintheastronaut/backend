import { User } from './User';
import { IngredientToShoppingList } from './IngredientToShoppingList';
import { ShoppingListStatus } from './../constants/shoppingListStatus';
import { ShoppingListType } from '../constants/shoppingListType';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
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

  @Column({
    nullable: true,
  })
  groupId: string;

  @Column({
    nullable: true,
  })
  userId: string;

  @Column({
    default: '',
  })
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

  @ManyToOne(() => User, (user) => user.shoppingLists)
  user: User;

  @OneToMany(
    () => IngredientToShoppingList,
    (ingredientToShoppingList) => ingredientToShoppingList.shoppingList,
  )
  public ingredientsToShoppingList!: IngredientToShoppingList[];
}
