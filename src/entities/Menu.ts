import { User } from 'src/entities';
import { DishToMenu } from './DishToMenu';
import { IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Dish } from './Dish';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  @IsString()
  id: string;

  @Column({
    nullable: false,
  })
  @IsString()
  date: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Dish)
  @JoinTable()
  dishes: Dish[];

  @ManyToOne(() => User, (user) => user.menus)
  user: User;

  @OneToMany(() => DishToMenu, (dishToMenu) => dishToMenu.menu)
  public dishToMenus!: DishToMenu[];
}
