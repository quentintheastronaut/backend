import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { User } from './../enitities/User';

@EntityRepository(User)
export class UserRepository extends Repository<User> {}
