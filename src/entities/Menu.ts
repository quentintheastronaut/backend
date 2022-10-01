import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Dish } from './Dish';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  @IsString()
  id: string;

  @Column({
    nullable: false,
    default: 1663606425,
  })
  date: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Dish)
  @JoinTable()
  dishes: Dish[];
}
