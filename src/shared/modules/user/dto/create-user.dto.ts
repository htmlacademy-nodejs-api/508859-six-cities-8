import { IsEmail, IsEnum, IsString, Length } from 'class-validator';

import { USER_DTO_CONSTRAINTS } from '../user.constant.js';
import { UserType } from '../../../types/user-type.enum.js';

export class CreateUserDTO {
  @IsEmail()
  public email!: string;

  @IsString()
  @Length(USER_DTO_CONSTRAINTS.USERNAME.MIN_LENGTH, USER_DTO_CONSTRAINTS.USERNAME.MAX_LENGTH)
  public userName!: string;

  @IsString()
  @Length(USER_DTO_CONSTRAINTS.PASSWORD.MIN_LENGTH, USER_DTO_CONSTRAINTS.PASSWORD.MAX_LENGTH)
  public password!: string;

  @IsEnum(UserType)
  public type!: UserType;
}
