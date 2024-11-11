import { UserType } from '../../const';

export class CreateUserDTO {
  public email!: string;

  public userName!: string;

  public password!: string;

  public type!: UserType;
}
