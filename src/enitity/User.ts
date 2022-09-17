import moment from 'moment';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

enum Sex {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: string;

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
    nullable: false,
    type: 'enum',
    enum: Sex,
    default: Sex.MALE,
  })
  sex: string;

  @Column({
    default: 0,
  })
  height: number;

  @Column({
    default: 0,
  })
  weight: number;

  @Column({
    default: '',
  })
  imageUrl: string;

  @Column({
    default: '',
  })
  healthGoal: string;

  @Column({
    default: '',
  })
  groupId: string;

  @Column({
    default: 0,
  })
  desiredWeight: number;

  @Column({
    default: '',
  })
  activityIntensity: string;

  @Column({
    nullable: false,
    default: '',
    unique: true,
  })
  email: string;

  @Column({
    nullable: false,
    default: '',
  })
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
