import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';
import { GroupRole } from 'src/constants/groupRole';
import { Group } from './Group';

@Entity()
export class UserToGroup {
  @PrimaryGeneratedColumn()
  public userToGroupId!: string;

  @Column()
  public groupId!: string;

  @Column()
  public userId!: string;

  @Column()
  public role!: GroupRole;

  @ManyToOne(() => User, (user) => user.userToGroups, {
    onDelete: 'CASCADE',
  })
  public user!: User;

  @ManyToOne(() => Group, (group) => group.userToGroups, {
    onDelete: 'CASCADE',
  })
  public group!: Group;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
