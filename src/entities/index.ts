import { GroupShoppingList } from './GroupShoppingList';
import { GroupMenu } from './GroupMenu';
import { Account } from './Account';
import { WeightRecord } from './WeightRecord';
import { Measurement } from './Measurement';
import { IngredientToDish } from './IngredientToDish';
import { IngredientToShoppingList } from './IngredientToShoppingList';
import { ShoppingList } from './ShoppingList';
import { Group } from './Group';
import { Ingredient } from './Ingredient';
import { Dish } from './Dish';
import { Menu } from './Menu';
import { User } from './User';
import { UserToGroup } from './UserToGroup';
import { DishToMenu } from './DishToMenu';
import { Admin } from './Admin';
import { IndividualMenu } from './IndividualMenu';
import { Allergic } from './Allergic';
import { IndividualShoppingList } from './IndividualShoppingList';

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
  IngredientToDish,
  Measurement,
  WeightRecord,
  Account,
  Admin,
  GroupMenu,
  IndividualMenu,
  GroupShoppingList,
  Allergic,
  IndividualShoppingList,
];

export default entities;
