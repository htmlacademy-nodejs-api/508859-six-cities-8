import { UserType } from '../../const';

export class UserDTO {
  public id!: string;
  
  public email!: string;

  public avatarPath!: string;

  public userName!: string;

  public type!: UserType;
}
