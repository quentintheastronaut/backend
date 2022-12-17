import { Measurement } from './Measurement';
import { Ingredient } from './Ingredient';
import { ShoppingList } from './ShoppingList';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class IngredientToShoppingList {
  @PrimaryGeneratedColumn()
  public ingredientToShoppingListId!: string;

  @Column({
    default: 1,
  })
  public quantity!: number;

  @ManyToOne(
    () => Measurement,
    (measurement) => measurement.ingredientToShoppingList,
  )
  measurementType: Measurement;

  @Column({
    default: false,
  })
  public checked!: boolean;

  @ManyToOne(
    () => ShoppingList,
    (shoppingList) => shoppingList.ingredientsToShoppingList,
    {
      onDelete: 'CASCADE',
    },
  )
  public shoppingList!: ShoppingList;

  @ManyToOne(
    () => Ingredient,
    (ingredient) => ingredient.ingredientsToShoppingList,
    {
      onDelete: 'CASCADE',
    },
  )
  public ingredient!: Ingredient;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
