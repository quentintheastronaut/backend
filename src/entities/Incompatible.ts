import { Column } from 'typeorm';
import { Ingredient } from './Ingredient';
import { UpdateDateColumn } from 'typeorm';
import { IsString } from 'class-validator';
import { PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Entity } from 'typeorm';
// REFACTOR
@Entity()
export class Incompatible {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  @IsString()
  id: string;

  @ManyToOne(() => Ingredient, (user) => user.isIncompatibleTo)
  isIncompatibleTo: Ingredient;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.isIncompatibleBy)
  isIncompatibleBy: Ingredient;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // @Column({
  //   default: '',
  // })
  // note: string;
}
