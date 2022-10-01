import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { User } from '../entities/User';

@EntityRepository(User)
export class UserRepository extends Repository<User> {}
