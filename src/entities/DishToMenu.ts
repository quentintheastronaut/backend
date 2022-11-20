import { ShoppingListType } from './../constants/shoppingListType';
import { MealType } from 'src/constants/mealType';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Dish } from './Dish';
import { Menu } from './Menu';

@Entity()
export class DishToMenu {
  @PrimaryGeneratedColumn()
  public dishToMenuId!: string;

  @Column()
  public dishId!: string;

  @Column()
  public menuId!: string;

  @Column()
  public meal!: MealType;

  @Column()
  public quantity!: number;

  @Column()
  public type!: ShoppingListType;

  @Column({
    default: false,
  })
  public tracked!: boolean;

  @ManyToOne(() => Dish, (dish) => dish.dishToMenus)
  public dish!: Dish;

  @ManyToOne(() => Menu, (menu) => menu.dishToMenus)
  public menu!: Menu;
}
