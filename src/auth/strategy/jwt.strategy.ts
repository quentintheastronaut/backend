import { AppDataSource } from './../../data-source';
import * as dotenv from 'dotenv';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtUser } from '../dto/parsedToken.dto';
import { User } from 'src/enitity';

dotenv.config({
  path: `.env`,
});

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(jwtUser: JwtUser) {
    return jwtUser;
  }
}
