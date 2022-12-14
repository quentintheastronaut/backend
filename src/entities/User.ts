import { IndividualShoppingList } from './IndividualShoppingList';
import { WeightRecord } from './WeightRecord';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserToGroup } from './UserToGroup';
import { AccountRole } from 'src/constants/accountRole';
import { Account } from './Account';
import { IndividualMenu } from './IndividualMenu';
import { Allergic } from './Allergic';

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
    nullable: true,
    default: '',
  })
  dob: string;

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
    default: 0,
  })
  age: number;

  @Column({
    default: '',
  })
  imageUrl: string;

  @Column({
    default: '',
  })
  healthGoal: string;

  @Column({
    default: 0,
  })
  desiredWeight: number;

  @Column({
    default: '',
  })
  activityIntensity: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    default: true,
  })
  active: boolean;

  @Column({
    default: AccountRole.USER,
  })
  role: string;

  @OneToMany(() => WeightRecord, (weightRecord) => weightRecord.user, {
    onDelete: 'CASCADE',
  })
  weightRecords: WeightRecord[];

  @OneToMany(() => UserToGroup, (userToGroup) => userToGroup.user, {
    onDelete: 'CASCADE',
  })
  public userToGroups!: UserToGroup[];

  //new
  @OneToOne(() => Account)
  @JoinColumn()
  account: Account;

  // new
  @OneToMany(() => IndividualMenu, (individualMenu) => individualMenu.user)
  individualMenus: IndividualMenu[];

  // new
  @OneToMany(
    () => IndividualShoppingList,
    (individualShoppingList) => individualShoppingList.user,
  )
  individualShoppingLists: IndividualShoppingList[];

  // new
  @OneToMany(() => Allergic, (allergic) => allergic.user)
  isAllergic: Allergic[];
}
