import { UpdateUserDto } from './../../modules/happyMeal/user/dto/request/updateUser.dto';
import { SetBaseCaloriesDto } from './dto/request/setBaseCalories.dto';
import { SetIngredientDto } from './dto/request/setIngredient.dto';
import { SetBlacklistDto } from './dto/request/setBlacklist.dto';
import { SetFavoriteDto } from './dto/request/setFavorite.dto';
import { RecommendationDto } from './dto/request/recommendation.dto';
import { AddPlanDto } from './dto/request/addPlan.dto';
import { AddTrackDto } from './dto/request/addTrack.dto';
import { HttpService } from '@nestjs/axios';
import {
  ForbiddenException,
  HttpStatus,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { RecombeeConfig } from 'src/config/recombee';
import { PageDto } from 'src/dtos';
import { DetailViewsDto } from './dto/request/detailViews.dto';
import { catchError, firstValueFrom, map } from 'rxjs';
import * as moment from 'moment';
import { HmacSHA1 } from 'crypto-js';
import * as CryptoJS from 'crypto-js';
import { AddFavoriteDto } from './dto/request/addFavorite.dto';
import { SetAllergicDto } from './dto/request/setAllergic.dto';

@Injectable()
export class RecombeeService {
  constructor(private http: HttpService) {}

  private logger: Logger = new Logger('Recombee');

  // INTERACTION SERVICES
  // done
  async sendViewDetail(detailViewsDto: DetailViewsDto) {
    try {
      const hmacTimestamp = moment().unix();

      const url = `/${RecombeeConfig.myDb}/detailviews/?hmac_timestamp=${hmacTimestamp}`;

      const sign = HmacSHA1(url, RecombeeConfig.privateToken).toString(
        CryptoJS.enc.Hex,
      );

      await firstValueFrom(
        this.http
          .post(
            `https://${RecombeeConfig.host}${url}&hmac_sign=${sign}`,
            detailViewsDto,
          )
          .pipe(
            catchError((error) => {
              throw new ForbiddenException(error?.response?.data?.message);
            }),
          ),
      );

      this.logger.log('SendViewDetail');
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      this.logger.log(error);
      throw new InternalServerErrorException();
    }
  }

  // User
  // done
  async sendAddUser(userId: string) {
    try {
      const hmacTimestamp = moment().unix();

      const url = `/${RecombeeConfig.myDb}/users/${userId}?hmac_timestamp=${hmacTimestamp}`;

      const sign = HmacSHA1(url, RecombeeConfig.privateToken).toString(
        CryptoJS.enc.Hex,
      );

      await firstValueFrom(
        this.http
          .put(`https://${RecombeeConfig.host}${url}&hmac_sign=${sign}`)
          .pipe(
            catchError((error) => {
              throw new ForbiddenException(error?.response?.data?.message);
            }),
          ),
      );
      this.logger.log('SendAddUser');
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  // done
  async sendSetUser(userId: string, updateUserDto: UpdateUserDto) {
    try {
      const hmacTimestamp = moment().unix();

      const url = `/${RecombeeConfig.myDb}/users/${userId}?hmac_timestamp=${hmacTimestamp}`;

      const sign = HmacSHA1(url, RecombeeConfig.privateToken).toString(
        CryptoJS.enc.Hex,
      );

      await firstValueFrom(
        this.http
          .post(`https://${RecombeeConfig.host}${url}&hmac_sign=${sign}`, {
            ...updateUserDto,
            cascadeCreate: true,
          })
          .pipe(
            catchError((error) => {
              throw new ForbiddenException(error?.response?.data?.message);
            }),
          ),
      );
      this.logger.log('SendSetUser');
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  // Track
  // done
  async addTrack(addTrackDto: AddTrackDto) {
    try {
      const hmacTimestamp = moment().unix();

      const url = `/${RecombeeConfig.myDb}/purchases/?hmac_timestamp=${hmacTimestamp}`;

      const sign = HmacSHA1(url, RecombeeConfig.privateToken).toString(
        CryptoJS.enc.Hex,
      );

      await firstValueFrom(
        this.http
          .post(
            `https://${RecombeeConfig.host}${url}&hmac_sign=${sign}`,
            addTrackDto,
          )
          .pipe(
            catchError((error) => {
              throw new ForbiddenException(error?.response?.data?.message);
            }),
          ),
      );
      this.logger.log('AddTrackDish');
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  // done
  async deleteTrack(addTrackDto: AddTrackDto) {
    try {
      const hmacTimestamp = moment().unix();
      const { userId, itemId } = addTrackDto;
      const url = `/${RecombeeConfig.myDb}/purchases/?userId=${userId}&itemId=${itemId}&hmac_timestamp=${hmacTimestamp}`;

      const sign = HmacSHA1(url, RecombeeConfig.privateToken).toString(
        CryptoJS.enc.Hex,
      );

      await firstValueFrom(
        this.http
          .delete(`https://${RecombeeConfig.host}${url}&hmac_sign=${sign}`)
          .pipe(
            catchError((error) => {
              throw new ForbiddenException(error?.response?.data?.message);
            }),
          ),
      );
      this.logger.log('DeleteTrackDish');
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  // Plan
  // done
  async addPlanAddition(addPlanDto: AddPlanDto) {
    try {
      const hmacTimestamp = moment().unix();

      const url = `/${RecombeeConfig.myDb}/cartadditions/?hmac_timestamp=${hmacTimestamp}`;

      const sign = HmacSHA1(url, RecombeeConfig.privateToken).toString(
        CryptoJS.enc.Hex,
      );

      await firstValueFrom(
        this.http
          .post(
            `https://${RecombeeConfig.host}${url}&hmac_sign=${sign}`,
            addPlanDto,
          )
          .pipe(
            catchError((error) => {
              throw new ForbiddenException(error?.response?.data?.message);
            }),
          ),
      );
      this.logger.log('AddPlanAddition');
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async deletePlanAddition(addPlanDto: AddPlanDto) {
    try {
      const hmacTimestamp = moment().unix();
      const { userId, itemId } = addPlanDto;
      const url = `/${RecombeeConfig.myDb}/cartadditions/?userId=${userId}&itemId=${itemId}&hmac_timestamp=${hmacTimestamp}`;

      const sign = HmacSHA1(url, RecombeeConfig.privateToken).toString(
        CryptoJS.enc.Hex,
      );

      await firstValueFrom(
        this.http
          .delete(`https://${RecombeeConfig.host}${url}&hmac_sign=${sign}`)
          .pipe(
            catchError((error) => {
              throw new ForbiddenException(error?.response?.data?.message);
            }),
          ),
      );
      this.logger.log('DeletePlanAddition');
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  // Favorite
  // done
  async addFavoriteAddition(addFavoriteDto: AddFavoriteDto) {
    try {
      const hmacTimestamp = moment().unix();

      const url = `/${RecombeeConfig.myDb}/bookmarks/?hmac_timestamp=${hmacTimestamp}`;

      const sign = HmacSHA1(url, RecombeeConfig.privateToken).toString(
        CryptoJS.enc.Hex,
      );

      await firstValueFrom(
        this.http
          .post(
            `https://${RecombeeConfig.host}${url}&hmac_sign=${sign}`,
            addFavoriteDto,
          )
          .pipe(
            catchError((error) => {
              throw new ForbiddenException(error?.response?.data?.message);
            }),
          ),
      );
      this.logger.log('AddFavoriteAddition');
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async deleteFavoriteAddition(addFavoriteDto: AddFavoriteDto) {
    try {
      const hmacTimestamp = moment().unix();
      const { userId, itemId } = addFavoriteDto;
      const url = `/${RecombeeConfig.myDb}/bookmarks/?userId=${userId}&itemId=${itemId}&hmac_timestamp=${hmacTimestamp}`;

      const sign = HmacSHA1(url, RecombeeConfig.privateToken).toString(
        CryptoJS.enc.Hex,
      );

      await firstValueFrom(
        this.http
          .delete(`https://${RecombeeConfig.host}${url}&hmac_sign=${sign}`)
          .pipe(
            catchError((error) => {
              throw new ForbiddenException(error?.response?.data?.message);
            }),
          ),
      );
      this.logger.log('DeleteFavoriteAddition');
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  // User
  // done
  async setUserAllergic(setAllergicDto: SetAllergicDto) {
    try {
      const { userId, allergic } = setAllergicDto;
      const hmacTimestamp = moment().unix();

      const url = `/${RecombeeConfig.myDb}/users/${userId}?hmac_timestamp=${hmacTimestamp}`;

      const sign = HmacSHA1(url, RecombeeConfig.privateToken).toString(
        CryptoJS.enc.Hex,
      );

      await firstValueFrom(
        this.http
          .post(`https://${RecombeeConfig.host}${url}&hmac_sign=${sign}`, {
            allergic: allergic,
          })
          .pipe(
            catchError((error) => {
              console.log(error);
              throw new ForbiddenException(error?.response?.data?.message);
            }),
          ),
      );
      this.logger.log('SetUserAllergic');
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  // done
  async setUserFavorite(setFavoriteDto: SetFavoriteDto) {
    try {
      const { userId, favorite } = setFavoriteDto;
      const hmacTimestamp = moment().unix();

      const url = `/${RecombeeConfig.myDb}/users/${userId}?hmac_timestamp=${hmacTimestamp}`;

      const sign = HmacSHA1(url, RecombeeConfig.privateToken).toString(
        CryptoJS.enc.Hex,
      );

      await firstValueFrom(
        this.http
          .post(`https://${RecombeeConfig.host}${url}&hmac_sign=${sign}`, {
            favorite: favorite,
          })
          .pipe(
            catchError((error) => {
              console.log(error);
              throw new ForbiddenException(error?.response?.data?.message);
            }),
          ),
      );
      this.logger.log('SetUserFavorite');
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  // done
  async setUserBlacklist(setBlacklistDto: SetBlacklistDto) {
    try {
      const { userId, blacklist } = setBlacklistDto;
      const hmacTimestamp = moment().unix();

      const url = `/${RecombeeConfig.myDb}/users/${userId}?hmac_timestamp=${hmacTimestamp}`;

      const sign = HmacSHA1(url, RecombeeConfig.privateToken).toString(
        CryptoJS.enc.Hex,
      );

      await firstValueFrom(
        this.http
          .post(`https://${RecombeeConfig.host}${url}&hmac_sign=${sign}`, {
            blacklist: blacklist,
          })
          .pipe(
            catchError((error) => {
              console.log(error);
              throw new ForbiddenException(error?.response?.data?.message);
            }),
          ),
      );
      this.logger.log('SetUserBlacklist');
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  // done
  async setUserBaseCalories(setBaseCaloriesDto: SetBaseCaloriesDto) {
    try {
      const { userId, baseCalories } = setBaseCaloriesDto;
      const hmacTimestamp = moment().unix();

      const url = `/${RecombeeConfig.myDb}/users/${userId}?hmac_timestamp=${hmacTimestamp}`;

      const sign = HmacSHA1(url, RecombeeConfig.privateToken).toString(
        CryptoJS.enc.Hex,
      );

      await firstValueFrom(
        this.http
          .post(`https://${RecombeeConfig.host}${url}&hmac_sign=${sign}`, {
            baseCalories: baseCalories,
          })
          .pipe(
            catchError((error) => {
              console.log(error);
              throw new ForbiddenException(error?.response?.data?.message);
            }),
          ),
      );
      this.logger.log('SetUserBaseCalories');
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  // Items
  async setItemIngredient(setIngredientDto: SetIngredientDto) {
    try {
      const { itemId, ingredient } = setIngredientDto;
      const hmacTimestamp = moment().unix();

      const url = `/${RecombeeConfig.myDb}/items/${itemId}?hmac_timestamp=${hmacTimestamp}`;

      const sign = HmacSHA1(url, RecombeeConfig.privateToken).toString(
        CryptoJS.enc.Hex,
      );

      await firstValueFrom(
        this.http
          .post(`https://${RecombeeConfig.host}${url}&hmac_sign=${sign}`, {
            ingredient: ingredient,
          })
          .pipe(
            catchError((error) => {
              console.log(error);
              throw new ForbiddenException(error?.response?.data?.message);
            }),
          ),
      );
      this.logger.log('SetItemIngredient');
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  // RECOMMEND SERVICES
  async recommend(recommendationDto: RecommendationDto) {
    try {
      const hmacTimestamp = moment().unix();
      const { userId, count } = recommendationDto;
      const url = `/${RecombeeConfig.myDb}/recomms/users/${userId}/items/?count=${count}&hmac_timestamp=${hmacTimestamp}`;

      const sign = HmacSHA1(url, RecombeeConfig.privateToken).toString(
        CryptoJS.enc.Hex,
      );

      const { data } = await firstValueFrom(
        this.http
          .get(`https://${RecombeeConfig.host}${url}&hmac_sign=${sign}`)
          .pipe(
            catchError((error) => {
              throw new ForbiddenException(error?.response?.data?.message);
            }),
          ),
      );
      this.logger.log('Recommend');
      return new PageDto('OK', HttpStatus.OK, data);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
