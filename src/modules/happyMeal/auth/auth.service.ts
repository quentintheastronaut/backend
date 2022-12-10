import { jwtTokenExpiryTime } from './constants';
import { Account } from './../../../entities/Account';
import { AccountDto } from './dto/account.dto';
import { JwtUser } from './dto/parsedToken.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { PageDto } from 'src/dtos/page.dto';
import * as dotenv from 'dotenv';
import { JwtService } from '@nestjs/jwt';
import { AppDataSource } from '../../../data-source';
import { AuthDto } from './dto/auth.dto';
import {
  ForbiddenException,
  Injectable,
  HttpStatus,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import * as argon from 'argon2';
import { UserService } from '../user/user.service';

dotenv.config({
  path: `.env`,
});
@Injectable({})
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService)) private _userService: UserService,
    @Inject(forwardRef(() => JwtService)) private jwt: JwtService,
  ) {}

  // COMMON SERVICES
  async insert(accountDto: AccountDto) {
    try {
      await AppDataSource.createQueryBuilder()
        .insert()
        .into(Account)
        .values([accountDto])
        .execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('');
    }
  }

  async findOneByEmail(email: string) {
    try {
      return await AppDataSource.getRepository(Account).findOne({
        where: { email },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }

  async findOneById(id: string) {
    try {
      return await AppDataSource.getRepository(Account).findOne({
        where: { id },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }

  async updateById(id: string, accountDto: AccountDto) {
    try {
      await AppDataSource.createQueryBuilder()
        .update(Account)
        .set(accountDto)
        .where('id = :id', { id })
        .execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async updateByEmail(email: string, accountDto: AccountDto) {
    try {
      await AppDataSource.createQueryBuilder()
        .update(Account)
        .set(accountDto)
        .where('id = :id', { email })
        .execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findOneAndUpdateById(id: string, accountDto: AccountDto) {
    try {
      await AppDataSource.createQueryBuilder()
        .update(Account)
        .set(accountDto)
        .where('id = :id', { id })
        .execute();

      return await this.findOneById(id);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findOneAndUpdateByEmail(email: string, accountDto: AccountDto) {
    try {
      await AppDataSource.createQueryBuilder()
        .update(Account)
        .set(accountDto)
        .where('id = :id', { email })
        .execute();

      return await this.findOneByEmail(email);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async isExistedEmail(email: string) {
    try {
      const account = await this.findOneByEmail(email);
      return account ? true : false;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async isValidOldPassword(jwtUser: JwtUser, oldPassword: string) {
    const account = await this.findOneByEmail(jwtUser.email);
    const pwMatches = await argon.verify(account.password, oldPassword);
    if (!pwMatches) {
      return false;
    }
    return true;
  }

  // CONTROLLER SERVICES
  async signUp(authDto: AuthDto) {
    const { email, password } = authDto;
    const hash = await argon.hash(password);
    await this.insert({ email, password: hash });
    try {
      const account = await this.findOneByEmail(authDto.email);

      const newUser = await this._userService.insert({});

      await this._userService.bindAccount(newUser.identifiers[0].id, account);

      await delete account.password;

      return this.signToken(parseInt(account.id, 10), email);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY')
        throw new ForbiddenException('Credentials taken');
    }
  }

  async hash(value) {
    return await argon.hash(value);
  }

  async changePassword(jwtUser: JwtUser, changePasswordDto: ChangePasswordDto) {
    if (
      !(await this.isValidOldPassword(jwtUser, changePasswordDto.oldPassword))
    ) {
      throw new BadRequestException('Old password is wrong !');
    }

    const hash = await this.hash(changePasswordDto.newPassword);

    try {
      await this.updateById(jwtUser.sub.toString(), { password: hash });
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async login(authDto: AuthDto) {
    const { email, password } = authDto;

    const account = await this.findOneByEmail(email);

    if (!account) {
      throw new ForbiddenException('Credential incorrect');
    }

    const pwMatches = await argon.verify(account.password, password);
    if (!pwMatches) {
      throw new ForbiddenException('Credential incorrect');
    }

    delete account.password;

    return this.signToken(parseInt(account.id, 10), email);
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
      expiresIn: jwtTokenExpiryTime,
      secret: process.env.JWT_SECRET,
    });

    return new PageDto('OK', HttpStatus.OK, { accessToken: token });
  }

  async resetPassword(id: number, password: string) {
    const hash = await argon.hash(password);

    try {
      await this.updateById(id.toString(), { password: hash });
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
