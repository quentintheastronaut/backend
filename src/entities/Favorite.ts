import { UpdateDateColumn } from 'typeorm';
import { CreateDateColumn } from 'typeorm';
import { IsString } from 'class-validator';
import { ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { Ingredient } from './Ingredient';
import { User } from './User';

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  @IsString()
  id: string;

  @ManyToOne(() => User, (user) => user.isFavorite)
  user: User;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.isFavoriteBy)
  ingredient: Ingredient;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
