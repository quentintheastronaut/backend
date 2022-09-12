import { User } from './../enitity/User';
import { AppDataSource } from './../data-source';
import { JwtUser } from './../auth/dto/parsedToken.dto';
import { Injectable } from '@nestjs/common';

@Injectable({})
export class UserService {
  async getProfile(jwtUser: JwtUser) {
    const { email } = jwtUser;
    const user = await AppDataSource.getRepository(User).findOne({
      where: {
        email,
      },
    });
    console.log(email);
    delete user.password;
    return user;
  }
}
