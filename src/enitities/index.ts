import { ShoppingList } from './ShoppingList';
import { Group } from './Group';
import { Ingredient } from './Ingredient';
import { Dish } from './Dish';
import { Menu } from './Menu';
import { User } from './User';
import { UserToGroup } from './UserToGroup';

export { User };

const entities = [
  UserToGroup,
  User,
  Menu,
  Dish,
  Ingredient,
  Group,
  ShoppingList,
];

export default entities;
