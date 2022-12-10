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
import { Allergic } from './Allergic';

// REFACTOR
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

  @Column({
    default: 0,
  })
  suggestedPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => IngredientToShoppingList,
    (ingredientToShoppingList) => ingredientToShoppingList.ingredient,
    {
      onDelete: 'CASCADE',
    },
  )
  public ingredientsToShoppingList!: IngredientToShoppingList[];

  @OneToMany(
    () => IngredientToDish,
    (ingredientToDish) => ingredientToDish.ingredient,
    {
      onDelete: 'CASCADE',
    },
  )
  public ingredientsToDish!: IngredientToDish[];

  // new
  @OneToMany(() => Allergic, (allergic) => allergic.ingredient)
  isAllergicBy: Allergic[];
}
