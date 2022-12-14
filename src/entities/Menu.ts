import { ShoppingListType } from 'src/constants';
import { DishToMenu } from './DishToMenu';
import { IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  @IsString()
  id: string;

  @Column({
    nullable: false,
    default: ShoppingListType.INDIVIDUAL,
  })
  type: ShoppingListType;

  @OneToMany(() => DishToMenu, (dishToMenu) => dishToMenu.menu, {
    onDelete: 'CASCADE',
  })
  public dishToMenus!: DishToMenu[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
