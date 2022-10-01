import { Dish } from 'src/enitities/Dish';
import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

@EntityRepository(Dish)
export class DishRepository extends Repository<Dish> {}
