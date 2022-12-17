import { ShoppingListType } from './../constants/shoppingListType';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Dish } from './Dish';
import { Menu } from './Menu';
import { Meal } from './Meal';

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
}
