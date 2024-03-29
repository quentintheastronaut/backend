import { UpdateDateColumn } from 'typeorm';
import { CreateDateColumn } from 'typeorm';
import { IsString } from 'class-validator';
import { ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { User } from './User';
import { Dish } from './Dish';

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  @IsString()
  id: string;

  @ManyToOne(() => User, (user) => user.isFavoriteBy)
  user: User;

  @ManyToOne(() => Dish, (dish) => dish.isFavorite)
  dish: Dish;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
