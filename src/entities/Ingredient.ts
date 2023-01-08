import { Incompatible } from './Incompatible';
import { IngredientToDish } from './IngredientToDish';
import { IngredientToShoppingList } from './IngredientToShoppingList';
import { IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Allergic } from './Allergic';
import { Favorite } from './Favorite';
import { User } from './User';
import { Account } from './Account';
import { IngredientCategory } from './IngredientCategory';

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

  @OneToOne(() => Account)
  @JoinColumn()
  createdBy: Account;

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

  @ManyToOne(
    () => IngredientCategory,
    (ingredientCategory) => ingredientCategory.ingredients,
  )
  ingredientCategory: IngredientCategory;

  // new
  @OneToMany(() => Allergic, (allergic) => allergic.ingredient)
  isAllergicBy: Allergic[];

  // new
  @OneToMany(() => Incompatible, (favorite) => favorite.isIncompatibleTo)
  isIncompatibleTo: Incompatible[];

  @OneToMany(() => Incompatible, (favorite) => favorite.isIncompatibleBy)
  isIncompatibleBy: Incompatible[];
}
