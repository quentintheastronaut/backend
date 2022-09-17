import { UpdateProfileDto } from './dto/request/updateProfile.dto';
import { User } from './../enitity/User';
import { AppDataSource } from './../data-source';
import { JwtUser } from './../auth/dto/parsedToken.dto';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable({})
export class UserService {
  async getProfile(jwtUser: JwtUser) {
    const { email } = jwtUser;
    const user = await AppDataSource.getRepository(User).findOne({
      where: {
        email,
      },
    });
    delete user.password;
    return user;
  }

  async updateProfile(jwtUser: JwtUser, updateProfileDto: UpdateProfileDto) {
    try {
      const { email } = jwtUser;
      await AppDataSource.createQueryBuilder()
        .update(User)
        .set(updateProfileDto)
        .where('email = :email', { email: email })
        .execute();

      return {
        message: 'Successfully',
      };
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
