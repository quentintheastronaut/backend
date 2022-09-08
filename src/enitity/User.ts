import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  first_name: string;

  @Column({
    nullable: false,
    default: '',
  })
  last_name: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: Sex,
    default: Sex.MALE,
  })
  sex: string;

  @Column({
    type: 'date',
    nullable: false,
  })
  birthday: Date;

  @Column({
    nullable: false,
    default: '',
  })
  email: string;

  @Column({
    name: 'email',
    nullable: false,
    default: '',
  })
  password: string;
}
