import { IsEmail, IsEnum, IsString, Length } from 'class-validator';

import { UserType } from '../../../types/user-type.enum.js';
import { USER_DTO_CONSTRAINTS } from '../user.constant.js';

export class CreateUserDto {
  @IsEmail()
  public email!: string;

  // TODO: Указываем дефолтное значение и поле необязательно
  @IsString()
  public avatarPath!: string;

  @IsString()
  @Length(USER_DTO_CONSTRAINTS.USERNAME.MIN_LENGTH, USER_DTO_CONSTRAINTS.USERNAME.MAX_LENGTH)
  public userName!: string;

  @IsString()
  @Length(USER_DTO_CONSTRAINTS.PASSWORD.MIN_LENGTH, USER_DTO_CONSTRAINTS.PASSWORD.MAX_LENGTH)
  public password!: string;

  @IsEnum(UserType)
  public type!: UserType;
}
