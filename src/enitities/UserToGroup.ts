import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @ManyToOne(() => User, (user) => user.userToGroups)
  public user!: User;

  @ManyToOne(() => Group, (group) => group.userToGroups)
  public group!: Group;
}
