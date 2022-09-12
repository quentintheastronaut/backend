import { IsNumber, IsString } from 'class-validator';

export class JwtUser {
  @IsNumber()
  sub: number;

  @IsString()
  email: string;

  @IsNumber()
  iat: number;

  @IsNumber()
  exp: number;
}

export class ParsedToken {
  user: JwtUser;
}
