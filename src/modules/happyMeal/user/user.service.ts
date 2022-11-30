import { PhysicalActivityFactor } from './../../../constants/physicalAbilityFactor';
import { PageDto } from 'src/dtos';
import { BodyMassIndex } from './../../../constants/bodyMassIndex';
import { SexType } from 'src/constants/sexType';
import { UpdateProfileDto } from './dto/request/updateProfile.dto';
import { User } from '../../../entities/User';
import { AppDataSource } from '../../../data-source';
import { JwtUser } from '../auth/dto/parsedToken.dto';
import { BadRequestException, Injectable, HttpStatus } from '@nestjs/common';

@Injectable({})
export class UserService {
  convertKilogramsToPounds(kilograms: number): number {
    return kilograms * 2.2;
  }

  convertPoundsToKilograms(pounds: number): number {
    return pounds / 2.2;
  }

  convertCentimetersToInches(centimeters: number): number {
    return centimeters * 0.393700787;
  }

  convertInchesToCentimeters(inches: number): number {
    return inches / 0.393700787;
  }

  bmr(weight: number, height: number, age: number, sex: string) {
    if (sex === SexType.MALE) {
      return 66 + 13.7 * weight + 5 * height - 6.8 * age;
    }
    return 655 + 9.6 * weight + 1.8 * height - 4.7 * age;
  }

  bmi(weight: number, height: number) {
    const w = this.convertKilogramsToPounds(weight);
    const h = this.convertCentimetersToInches(height);
    return (w / (h * h)) * 703;
  }

  categorizeBMI(bmi: number) {
    if (bmi < 18.5) {
      return BodyMassIndex.UNDER_WEIGHT;
    } else if (bmi >= 18.5 && bmi < 25) {
      return BodyMassIndex.NORMAL_WEIGHT;
    } else if (bmi >= 25 && bmi < 30) {
      return BodyMassIndex.OVER_WEIGHT;
    } else if (bmi >= 30 && bmi < 35) {
      return BodyMassIndex.OBESE_CLASS_1;
    } else if (bmi >= 35 && bmi < 40) {
      return BodyMassIndex.OBESE_CLASS_2;
    }
    return BodyMassIndex.OBESE_CLASS_3;
  }

  dailyCalories(bmr: number, activityIntensity: string) {
    switch (activityIntensity) {
      case PhysicalActivityFactor.SEDENTARY:
        return bmr * 1.2;
      case PhysicalActivityFactor.LIGHTLY_ACTIVE:
        return bmr * 1.375;
      case PhysicalActivityFactor.MODERATELY_ACTIVE:
        return bmr * 1.55;
      case PhysicalActivityFactor.VERY_ACTIVE:
        return bmr * 1.725;
      case PhysicalActivityFactor.EXTRA_ACTIVE:
        return bmr * 1.9;
    }
  }

  async getProfile(jwtUser: JwtUser) {
    try {
      const { email } = jwtUser;
      const user = await AppDataSource.getRepository(User).findOne({
        where: {
          email,
        },
      });
      delete user.password;
      return new PageDto('OK', HttpStatus.OK, user);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async updateProfile(jwtUser: JwtUser, updateProfileDto: UpdateProfileDto) {
    try {
      const { email } = jwtUser;
      await AppDataSource.createQueryBuilder()
        .update(User)
        .set(updateProfileDto)
        .where('email = :email', { email: email })
        .execute();

      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async getBodyMassIndex(jwtUser: JwtUser) {
    try {
      const { email } = jwtUser;
      const user = await AppDataSource.getRepository(User).findOne({
        where: {
          email,
        },
      });

      const currentBMI = this.bmi(user.weight, user.height);

      const result = {
        currentBMI,
        type: this.categorizeBMI(currentBMI),
      };

      return new PageDto('OK', HttpStatus.OK, result);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async getBasalMetabolicRate(jwtUser: JwtUser) {
    try {
      const { email } = jwtUser;
      const user = await AppDataSource.getRepository(User).findOne({
        where: {
          email,
        },
      });

      const currentBMR = this.bmr(user.weight, user.height, user.age, user.sex);

      const result = {
        currentBMR,
        dailyCalories: this.dailyCalories(currentBMR, user.activityIntensity),
      };

      return new PageDto('OK', HttpStatus.OK, result);
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
