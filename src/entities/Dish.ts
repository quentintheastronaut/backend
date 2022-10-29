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

  @Column({
    default: '',
  })
  recipeId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Ingredient)
  @JoinTable()
  ingredients: Ingredient[];

  @OneToMany(() => DishToMenu, (dishToMenu) => dishToMenu.dish)
  public dishToMenus!: DishToMenu[];
}
