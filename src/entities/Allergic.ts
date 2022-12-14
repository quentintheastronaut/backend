import { IsString } from 'class-validator';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Ingredient } from './Ingredient';
import { User } from './User';

// REFACTOR
@Entity()
export class Allergic {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  @IsString()
  id: string;

  @ManyToOne(() => User, (user) => user.isAllergic)
  user: User;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.isAllergicBy)
  ingredient: Ingredient;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
