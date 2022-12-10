import { Menu } from './Menu';
import { Group } from './Group';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsString } from 'class-validator';

// REFACTOR
@Entity()
export class GroupMenu {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: string;

  @Column()
  @IsString()
  date: string;

  @ManyToOne(() => Group, (group) => group.groupMenus)
  group: Group;

  @OneToOne(() => Menu)
  @JoinColumn()
  menu: Menu;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
