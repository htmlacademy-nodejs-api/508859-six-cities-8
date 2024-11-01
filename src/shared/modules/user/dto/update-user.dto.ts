import { IsEmail, IsEnum, IsString, Length } from 'class-validator';
import { UserType } from '../../../types/index.js';
import { UPDATE_USER_MESSAGES } from './update-user.messages.js';

export class UpdateUserDto {
  @IsEmail({}, { message: UPDATE_USER_MESSAGES.EMAIL.invalidFormat })
  public email!: string;

  // TODO: Указываем дефолтное значение и поле необязательно
  @IsString({ message: UPDATE_USER_MESSAGES.AVATAR_PATH.invalidFormat })
  public avatarPath!: string;

  @IsString({ message: UPDATE_USER_MESSAGES.USERNAME.invalidFormat })
  @Length(1, 15, { message: UPDATE_USER_MESSAGES.USERNAME.lengthField })
  public userName!: string;

  @IsString({ message: UPDATE_USER_MESSAGES.PASSWORD.invalidFormat })
  @Length(6, 12, { message: UPDATE_USER_MESSAGES.PASSWORD.lengthField })
  public password!: string;

  @IsEnum(UserType, { message: UPDATE_USER_MESSAGES.USER_TYPE.invalid })
  public type!: UserType;
}
