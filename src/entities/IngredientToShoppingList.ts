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
