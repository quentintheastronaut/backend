import { Ingredient } from './Ingredient';
import { Dish } from './Dish';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class IngredientToDish {
  @PrimaryGeneratedColumn()
  public ingredientToDishId!: string;

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

  @ManyToOne(() => Dish, (dish) => dish.ingredientsToDish, {
    onDelete: 'CASCADE',
  })
  public dish!: Dish;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.ingredientsToDish, {
    onDelete: 'CASCADE',
  })
  public ingredient!: Ingredient;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
