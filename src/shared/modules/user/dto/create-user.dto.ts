import { IsEmail, IsEnum, IsString, Length } from 'class-validator';

import { CREATE_USER_MESSAGES } from './create-user.messages.js';

import { UserType } from '../../../types/user-type.enum.js';

export class CreateUserDto {
  @IsEmail({}, { message: CREATE_USER_MESSAGES.EMAIL.invalidFormat })
  public email!: string;

  // TODO: Указываем дефолтное значение и поле необязательно
  @IsString({ message: CREATE_USER_MESSAGES.AVATAR_PATH.invalidFormat })
  public avatarPath!: string;

  @IsString({ message: CREATE_USER_MESSAGES.USERNAME.invalidFormat })
  @Length(1, 15, { message: CREATE_USER_MESSAGES.USERNAME.lengthField })
  public userName!: string;

  @IsString({ message: CREATE_USER_MESSAGES.PASSWORD.invalidFormat })
  @Length(6, 12, { message: CREATE_USER_MESSAGES.PASSWORD.lengthField })
  public password!: string;

  @IsEnum(UserType, { message: CREATE_USER_MESSAGES.USER_TYPE.invalid })
  public type!: UserType;
}
