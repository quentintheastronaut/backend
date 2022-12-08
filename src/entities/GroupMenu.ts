import { Menu } from './Menu';
import { Group } from './Group';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class GroupMenu {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: string;

  @ManyToOne(() => Group, (group) => group.groupMenus)
  group: Group;

  @OneToOne(() => Menu)
  @JoinColumn()
  menu: Menu;
}
