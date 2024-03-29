import { IngredientToShoppingList } from 'src/entities/IngredientToShoppingList';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';
import { Account } from './Account';

@Entity()
export class Location {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: string;

  @Column({
    default: '',
    nullable: true,
  })
  name: string;

  @Column({
    default: '',
    nullable: true,
  })
  address: string;

  @Column({
    default: '',
    nullable: true,
  })
  longitude: string;

  @Column({
    default: '',
    nullable: true,
  })
  latitude: string;

  @OneToMany(
    () => IngredientToShoppingList,
    (ingredientToShoppingList) => ingredientToShoppingList.location,
  )
  ingredientToShoppingList: IngredientToShoppingList[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Account)
  @JoinColumn()
  createdBy: Account;
}
