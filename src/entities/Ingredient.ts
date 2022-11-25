import { IngredientToDish } from './IngredientToDish';
import { IngredientToShoppingList } from './IngredientToShoppingList';
import { IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  @IsString()
  id: string;

  @IsString()
  @Column()
  name: string;

  @Column({
    default: 0,
  })
  carbohydrates: number;

  @Column({
    default: 0,
  })
  fat: number;

  @Column({
    default: 0,
  })
  protein: number;

  @Column({
    default: 0,
  })
  calories: number;

  @Column({
    default: '',
  })
  imageUrl: string;

  @Column()
  suggestedPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => IngredientToShoppingList,
    (ingredientToShoppingList) => ingredientToShoppingList.ingredient,
  )
  public ingredientsToShoppingList!: IngredientToShoppingList[];

  @OneToMany(
    () => IngredientToDish,
    (ingredientToDish) => ingredientToDish.ingredient,
  )
  public ingredientsToDish!: IngredientToDish[];
}
