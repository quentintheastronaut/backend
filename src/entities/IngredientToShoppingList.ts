import { Ingredient } from 'src/entities/Ingredient';
import { ShoppingList } from 'src/entities/ShoppingList';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class IngredientToShoppingList {
  @PrimaryGeneratedColumn()
  public ingredientToShoppingList!: string;

  @Column()
  public ingredientId!: string;

  @Column()
  public shoppingListId!: string;

  @Column()
  public measurementId!: string;

  @Column()
  public quantity!: number;

  @ManyToOne(
    () => ShoppingList,
    (shoppingList) => shoppingList.ingredientsToShoppingList,
  )
  public shoppingList!: ShoppingList;

  @ManyToOne(
    () => Ingredient,
    (ingredient) => ingredient.ingredientsToShoppingList,
  )
  public ingredient!: Ingredient;
}
