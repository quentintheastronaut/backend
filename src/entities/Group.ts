import { Menu } from './Menu';
import { ShoppingList } from './ShoppingList';
import { IsString } from 'class-validator';
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
import { User } from './User';
import { UserToGroup } from './UserToGroup';

@Entity()
export class Group {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  @IsString()
  id: string;

  @IsString()
  @Column()
  name: string;

  @Column({
    nullable: false,
    default: '',
  })
  password: string;

  @Column({
    default: '',
  })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // @ManyToMany(() => User)
  // @JoinTable()
  // users: User[];

  @ManyToMany(() => ShoppingList, {
    onDelete: 'SET NULL',
  })
  @JoinTable()
  shoppingLists: ShoppingList[];

  @OneToMany(() => Menu, (menu) => menu.group, {
    onDelete: 'SET NULL',
  })
  menus: Menu[];

  @OneToMany(() => UserToGroup, (userToGroup) => userToGroup.group, {
    onDelete: 'SET NULL',
  })
  public userToGroups!: UserToGroup[];
}
