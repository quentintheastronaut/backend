import { ShoppingListType } from './../constants/shoppingListType';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Dish } from './Dish';
import { Menu } from './Menu';
import { Meal } from './Meal';
import { DishType } from 'src/constants/dishType';

// REFACTOR
@Entity()
export class DishToMenu {
  @PrimaryGeneratedColumn()
  public dishToMenuId!: string;

  @ManyToOne(() => Meal, (meal) => meal.dishToMenu)
  meal: Meal;

  @Column()
  public quantity!: number;

  @Column()
  public type!: ShoppingListType;

  @Column({
    default: false,
  })
  public tracked!: boolean;

  @ManyToOne(() => Dish, (dish) => dish.dishToMenus, {
    onDelete: 'CASCADE',
  })
  public dish!: Dish;

  @ManyToOne(() => Menu, (menu) => menu.dishToMenus, {
    onDelete: 'CASCADE',
  })
  public menu!: Menu;

  @Column({
    default: DishType.COOKING,
  })
  public dishType!: DishType;

  @Column({
    default: '',
  })
  public note: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
