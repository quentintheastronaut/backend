import { IngredientToShoppingList } from './IngredientToShoppingList';
import { ShoppingList } from './ShoppingList';
import { Group } from './Group';
import { Ingredient } from './Ingredient';
import { Dish } from './Dish';
import { Menu } from './Menu';
import { User } from './User';
import { UserToGroup } from './UserToGroup';
import { DishToMenu } from './DishToMenu';

export { User };

const entities = [
  DishToMenu,
  UserToGroup,
  IngredientToShoppingList,
  User,
  Menu,
  Dish,
  Ingredient,
  Group,
  ShoppingList,
];

export default entities;
