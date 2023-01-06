import { User } from 'src/entities';
import { Measurement } from './Measurement';
import { Ingredient } from './Ingredient';
import { ShoppingList } from './ShoppingList';
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
import { Location } from './Location';

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

  @Column({
    default: '',
  })
  public note: string;

  @ManyToOne(() => User, (user) => user.market, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  marketer: User;

  @ManyToOne(() => Location, (location) => location.ingredientToShoppingList)
  location: Location;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
