import { ShoppingListType } from './../constants/shoppingListType';
import { MealType } from 'src/constants/mealType';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Dish } from './Dish';
import { Menu } from './Menu';

// REFACTOR
@Entity()
export class DishToMenu {
  @PrimaryGeneratedColumn()
  public dishToMenuId!: string;

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

  @ManyToOne(() => Dish, (dish) => dish.dishToMenus, {
    onDelete: 'CASCADE',
  })
  public dish!: Dish;

  @ManyToOne(() => Menu, (menu) => menu.dishToMenus, {
    onDelete: 'CASCADE',
  })
  public menu!: Menu;
}
