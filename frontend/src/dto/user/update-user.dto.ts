import { UserType } from '../../const';

export class UpdateUserDTO {
  public email?: string;

  public avatarPath?: string;

  public userName?: string;

  public password?: string;

  public type?: UserType;
}
