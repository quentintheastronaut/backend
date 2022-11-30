import { ShoppingList } from './ShoppingList';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Menu } from './Menu';
import { UserToGroup } from './UserToGroup';

enum Sex {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: string;

  @Column({
    nullable: false,
    default: '',
  })
  firstName: string;

  @Column({
    nullable: false,
    default: '',
  })
  lastName: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: Sex,
    default: Sex.MALE,
  })
  sex: string;

  @Column({
    default: 0,
  })
  height: number;

  @Column({
    default: 0,
  })
  weight: number;

  @Column({
    default: 0,
  })
  age: number;

  @Column({
    default: '',
  })
  imageUrl: string;

  @Column({
    default: '',
  })
  healthGoal: string;

  @Column({
    default: '',
  })
  groupId: string;

  @Column({
    default: 0,
  })
  desiredWeight: number;

  @Column({
    default: '',
  })
  activityIntensity: string;

  @Column({
    nullable: false,
    default: '',
    unique: true,
  })
  email: string;

  @Column({
    nullable: false,
    default: '',
  })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Menu, (menu) => menu.user)
  menus: Menu[];

  @OneToMany(() => ShoppingList, (shoppingList) => shoppingList.user)
  shoppingLists: ShoppingList[];

  @OneToMany(() => UserToGroup, (userToGroup) => userToGroup.user)
  public userToGroups!: UserToGroup[];
}
