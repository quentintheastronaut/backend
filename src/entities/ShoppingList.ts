import { ShoppingListType } from './../constants/shoppingListType';
import { IngredientToShoppingList } from './IngredientToShoppingList';
import { ShoppingListStatus } from './../constants/shoppingListStatus';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsString } from 'class-validator';

@Entity()
export class ShoppingList {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: string;

  @Column({
    default: '',
  })
  marketTime: string;

  @Column({
    nullable: false,
  })
  status: ShoppingListStatus;

  @Column({
    nullable: false,
    default: ShoppingListType.INDIVIDUAL,
  })
  type: ShoppingListType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => IngredientToShoppingList,
    (ingredientToShoppingList) => ingredientToShoppingList.shoppingList,
    {
      onDelete: 'CASCADE',
    },
  )
  public ingredientsToShoppingList!: IngredientToShoppingList[];
}
