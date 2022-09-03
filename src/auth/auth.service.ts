import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  login() {
    return { msg: 'I have signed in' };
  }

  signUp() {
    return { msg: 'I have signed up' };
  }
}
