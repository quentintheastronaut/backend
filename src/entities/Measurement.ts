import { IngredientToShoppingList } from './IngredientToShoppingList';
import { IngredientToDish } from './IngredientToDish';
import { IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from './Account';

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

  @OneToOne(() => Account)
  @JoinColumn()
  createdBy: Account;

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
