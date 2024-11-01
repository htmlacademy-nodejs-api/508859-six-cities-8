import { IsEmail, IsString } from 'class-validator';

import { CREATE_LOGIN_USER_MESSAGES } from './login-user.messages.js';

export class LoginUserDto {
  @IsEmail({}, { message: CREATE_LOGIN_USER_MESSAGES.EMAIL.invalidFormat })
  public email!: string;

  @IsString({ message: CREATE_LOGIN_USER_MESSAGES.PASSWORD.invalidFormat })
  public password!: string;
}
