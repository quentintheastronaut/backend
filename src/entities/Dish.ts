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
import { DishToMenu } from './DishToMenu';

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
    default: 0,
    nullable: true,
  })
  carbohydrates: number;

  @Column({
    default: 0,
    nullable: true,
  })
  fat: number;

  @Column({
    default: 0,
    nullable: true,
  })
  protein: number;

  @Column({
    default: 0,
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
