import { Measurement } from './Measurement';
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

  @ManyToOne(() => Measurement, (measurement) => measurement.ingredientToDish)
  measurementType: Measurement;

  @ManyToOne(() => Dish, (dish) => dish.ingredientsToDish, {
    onDelete: 'CASCADE',
  })
  public dish!: Dish;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.ingredientsToDish, {
    onDelete: 'CASCADE',
  })
  public ingredient!: Ingredient;

  @Column()
  public note: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
