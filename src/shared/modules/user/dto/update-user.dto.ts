import { UserType } from '../../../types/index.js';

export class UpdateUserDto {
  public email!: string;
  // TODO: Указываем дефолтное значение и поле необязательно
  public avatarPath!: string;
  public userName!: string;
  // public firstName!: string;
  // public lastName!: string;
  public password!: string;
  public type!: UserType;
}
