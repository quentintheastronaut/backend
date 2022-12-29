import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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
  })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Account)
  @JoinColumn()
  createdBy: Account;
}
