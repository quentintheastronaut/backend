import { Menu } from './Menu';
import { User } from './User';
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

@Entity()
export class IndividualMenu {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: string;

  @Column()
  @IsString()
  date: string;

  @ManyToOne(() => User, (user) => user.individualMenus)
  user: User;

  @OneToOne(() => Menu, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  menu: Menu;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
