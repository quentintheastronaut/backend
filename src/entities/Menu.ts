import { Group } from './Group';
import { ShoppingListType } from 'src/constants';
import { User } from './User';
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

  @Column({
    nullable: false,
    default: ShoppingListType.INDIVIDUAL,
  })
  @IsString()
  type: ShoppingListType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Dish, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  dishes: Dish[];

  @ManyToOne(() => User, (user) => user.menus, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Group, (group) => group.menus, {
    onDelete: 'CASCADE',
  })
  group: Group;

  @OneToMany(() => DishToMenu, (dishToMenu) => dishToMenu.menu, {
    onDelete: 'CASCADE',
  })
  public dishToMenus!: DishToMenu[];
}
