import { IngredientToShoppingList } from './IngredientToShoppingList';
import { IngredientToDish } from './IngredientToDish';
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
export class Measurement {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  @IsString()
  id: string;

  @IsString()
  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => IngredientToDish,
    (ingredientToDish) => ingredientToDish.measurementType,
  )
  ingredientToDish: IngredientToDish[];

  @OneToMany(
    () => IngredientToShoppingList,
    (ingredientToShoppingList) => ingredientToShoppingList.measurementType,
  )
  ingredientToShoppingList: IngredientToShoppingList[];
}
