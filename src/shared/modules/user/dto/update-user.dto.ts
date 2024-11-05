import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { UserType } from '../../../types/index.js';
import { USER_DTO_CONSTRAINTS } from '../user.constant.js';

export class UpdateUserDTO {
  @IsOptional()
  @IsEmail()
  public email?: string;

  @IsOptional()
  @IsString()
  public avatarPath?: string;

  @IsOptional()
  @IsString()
  @Length(USER_DTO_CONSTRAINTS.USERNAME.MIN_LENGTH, USER_DTO_CONSTRAINTS.USERNAME.MAX_LENGTH)
  public userName?: string;

  @IsOptional()
  @IsString()
  @Length(USER_DTO_CONSTRAINTS.PASSWORD.MIN_LENGTH, USER_DTO_CONSTRAINTS.PASSWORD.MAX_LENGTH)
  public password?: string;

  @IsOptional()
  @IsEnum(UserType)
  public type?: UserType;
}
