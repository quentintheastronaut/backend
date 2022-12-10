import { GroupShoppingList } from './GroupShoppingList';
import { IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserToGroup } from './UserToGroup';
import { GroupMenu } from './GroupMenu';

// REFACTOR
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

  @OneToMany(() => UserToGroup, (userToGroup) => userToGroup.group, {
    onDelete: 'CASCADE',
  })
  public userToGroups!: UserToGroup[];

  // new
  @OneToMany(() => GroupMenu, (groupMenu) => groupMenu.group)
  groupMenus: GroupMenu[];

  // new
  @OneToMany(
    () => GroupShoppingList,
    (groupShoppingList) => groupShoppingList.group,
  )
  groupShoppingLists: GroupShoppingList[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
