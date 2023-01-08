import { Ingredient } from './Ingredient';
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
export class IngredientCategory {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  @IsString()
  id: string;

  @IsString()
  @Column()
  name: string;

  @OneToMany(() => Ingredient, (ingredient) => ingredient.ingredientCategory)
  ingredients: Ingredient[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
