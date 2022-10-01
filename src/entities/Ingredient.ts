import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  @IsString()
  id: string;

  @IsString()
  @Column()
  name: string;

  @Column()
  carbohydrates: number;

  @Column()
  fat: number;

  @Column()
  protein: number;

  @Column()
  calories: number;

  @Column({
    default: '',
  })
  imageUrl: string;

  @Column()
  suggestedPrice: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
