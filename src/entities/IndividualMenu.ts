import { Menu } from './Menu';
import { User } from './User';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class IndividualMenu {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: string;

  @ManyToOne(() => User, (user) => user.individualMenus)
  user: User;

  @OneToOne(() => Menu)
  @JoinColumn()
  menu: Menu;
}
