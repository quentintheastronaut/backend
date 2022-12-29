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
import { DishToMenu } from './DishToMenu';
import { User } from './User';
import { Account } from './Account';

// REFACTOR
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
    default: '',
  })
  description: string;

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

  @Column('varchar', { length: 10000, default: '' })
  recipe: string;

  @Column({
    default: 30,
  })
  cookingTime: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Account)
  @JoinColumn()
  createdBy: Account;

  @OneToMany(() => DishToMenu, (dishToMenu) => dishToMenu.dish, {
    onDelete: 'CASCADE',
  })
  public dishToMenus!: DishToMenu[];

  @OneToMany(
    () => IngredientToDish,
    (ingredientToDish) => ingredientToDish.dish,
    {
      onDelete: 'CASCADE',
    },
  )
  public ingredientsToDish!: IngredientToDish[];
}
