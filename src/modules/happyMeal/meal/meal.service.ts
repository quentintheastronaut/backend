import { Injectable, NotFoundException } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { Meal } from 'src/entities/Meal';

@Injectable({})
export class MealService {
  public async find(id: string) {
    try {
      return await AppDataSource.getRepository(Meal).findOne({
        where: { id },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }
}
