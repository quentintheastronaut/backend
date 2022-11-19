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

  @Column()
  carbohydrates: number;

  @Column()
  fat: number;

  @Column()
  protein: number;

  @Column()
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
}
