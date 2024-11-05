import { Expose } from 'class-transformer';

export class LoggedUserRDO {
  @Expose()
  public token!: string;
}
