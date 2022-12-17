import { IsString } from 'class-validator';
import { SexType } from 'src/constants';
import { AccountRole } from 'src/constants/accountRole';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// REFACTORED
@Entity()
export class Account {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  @IsString()
  id: string;

  @Column({
    nullable: false,
    default: '',
    unique: true,
  })
  email: string;

  @Column({
    nullable: false,
    default: 'happymeal',
  })
  password: string;

  @Column({
    nullable: false,
    default: '',
  })
  firstName: string;

  @Column({
    nullable: false,
    default: '',
  })
  lastName: string;

  @Column({
    nullable: true,
    default: '',
  })
  dob: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: SexType,
    default: SexType.MALE,
  })
  sex: string;

  @Column({
    default: '',
  })
  imageUrl: string;

  @Column({
    nullable: false,
    default: AccountRole.USER,
  })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
