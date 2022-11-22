import { IngredientToDish } from './IngredientToDish';
import { IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DishToMenu } from './DishToMenu';
import { Ingredient } from './Ingredient';

@Entity()
export class Dish {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  @IsString()
  id: string;

  @IsString()
  @Column()
  name: string;

  @IsString()
  @Column({
    nullable: true,
  })
  slug: string;

  @Column({
    nullable: true,
  })
  carbohydrates: number;

  @Column({
    nullable: true,
  })
  fat: number;

  @Column({
    nullable: true,
  })
  protein: number;

  @Column({
    nullable: true,
  })
  calories: number;

  @Column({
    default: '',
  })
  imageUrl: string;

  @Column({
    default: '',
  })
  recipeId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => DishToMenu, (dishToMenu) => dishToMenu.dish)
  public dishToMenus!: DishToMenu[];

  @OneToMany(
    () => IngredientToDish,
    (ingredientToDish) => ingredientToDish.dish,
  )
  public ingredientsToDish!: IngredientToDish[];
}
