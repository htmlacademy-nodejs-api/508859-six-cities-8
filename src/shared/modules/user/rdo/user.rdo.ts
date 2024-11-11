import { Expose, Transform } from 'class-transformer';
import { UserType } from '../../../types/index.js';

export class UserRDO {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  public id!: string;

  @Expose()
  public email!: string;

  @Expose()
  public avatarPath!: string;

  @Expose()
  public userName!: string;

  @Expose()
  public type!: UserType;
}
