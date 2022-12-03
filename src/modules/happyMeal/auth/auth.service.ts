import { JwtUser } from './dto/parsedToken.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { PageDto } from 'src/dtos/page.dto';
import * as dotenv from 'dotenv';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../entities/User';
import { AppDataSource } from '../../../data-source';
import { AuthDto } from './dto/auth.dto';
import {
  ForbiddenException,
  Injectable,
  HttpStatus,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import * as argon from 'argon2';

dotenv.config({
  path: `.env`,
});
@Injectable({})
export class AuthService {
  constructor(private jwt: JwtService) {}

  async signUp(authDto: AuthDto) {
    // generate the password argon.hash
    const { email, password } = authDto;
    const hash = await argon.hash(password);

    try {
      await AppDataSource.createQueryBuilder()
        .insert()
        .into(User)
        .values([
          {
            email,
            password: hash,
          },
        ])
        .execute();

      const user = await AppDataSource.getRepository(User).findOne({
        where: {
          email,
        },
      });

      delete user.password;

      return this.signToken(parseInt(user.id, 10), email);

      // return saved user
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY')
        throw new ForbiddenException('Credentials taken');
    }
    // save the new user into db
  }

  async isValidOldPassword(jwtUser: JwtUser, oldPassword: string) {
    const user = await AppDataSource.getRepository(User).findOne({
      where: {
        email: jwtUser.email,
      },
    });
    const pwMatches = await argon.verify(user.password, oldPassword);
    if (!pwMatches) {
      return false;
    }
    return true;
  }

  async changePassword(jwtUser: JwtUser, changePasswordDto: ChangePasswordDto) {
    if (
      !(await this.isValidOldPassword(jwtUser, changePasswordDto.oldPassword))
    ) {
      throw new BadRequestException('Old password is wrong !');
    }

    const hash = await argon.hash(changePasswordDto.newPassword);

    try {
      await AppDataSource.createQueryBuilder()
        .update(User)
        .set({
          password: hash,
        })
        .where('id = :id', { id: jwtUser.sub })
        .execute();
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async login(authDto: AuthDto) {
    const { email, password } = authDto;

    const user = await AppDataSource.getRepository(User).findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Credential incorrect');
    }

    const pwMatches = await argon.verify(user.password, password);
    if (!pwMatches) {
      throw new ForbiddenException('Credential incorrect');
    }

    delete user.password;

    return this.signToken(parseInt(user.id, 10), email);
  }

  async signToken(
    id: number,
    email: string,
  ): Promise<PageDto<{ accessToken: string }>> {
    const payload = {
      sub: id,
      email,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '14d',
      secret: process.env.JWT_SECRET,
    });

    return new PageDto('OK', HttpStatus.OK, { accessToken: token });
  }

  async resetPassword(id: number, password: string) {
    const hash = await argon.hash(password);

    try {
      await AppDataSource.createQueryBuilder()
        .update(User)
        .set({
          password: hash,
        })
        .where('id = :id', { id: id.toString() })
        .execute();

      console.log(password);
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
