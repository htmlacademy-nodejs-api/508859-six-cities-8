import { Expose, Transform, Type } from 'class-transformer';
import { UserRDO } from '../../user/index.js';
export class CommentRDO {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  public id!: string;

  @Expose()
  public text!: string;

  @Expose({ name: 'createdAt' })
  public publicationDate!: string;

  @Expose()
  public rating!: number;

  @Expose({ name: 'userId'})
  @Type(() => UserRDO)
  public user!: UserRDO;
}
