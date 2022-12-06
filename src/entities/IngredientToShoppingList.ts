import { Ingredient } from './Ingredient';
import { ShoppingList } from './ShoppingList';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class IngredientToShoppingList {
  @PrimaryGeneratedColumn()
  public ingredientToShoppingListId!: string;

  @Column()
  public ingredientId!: string;

  @Column()
  public shoppingListId!: string;

  @Column({
    default: 1,
  })
  public quantity!: number;

  @Column({
    default: 'GRAMME',
  })
  public measurementType!: string;

  @Column({
    default: 0,
  })
  public weight!: number;

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
}
