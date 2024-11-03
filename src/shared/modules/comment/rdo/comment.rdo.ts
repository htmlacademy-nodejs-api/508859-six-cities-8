import { Expose, Transform, Type } from 'class-transformer';

import { UserRdo } from '../../user/rdo/user.rdo.js';

export class CommentRdo {
  @Expose()
  @Transform((params) => params.obj._id.toString())
  public id!: string;

  @Expose()
  public text!: string;

  @Expose({ name: 'createdAt' })
  public publicationDate!: string;

  @Expose({ name: 'userId'})
  @Type(() => UserRdo)
  public user!: UserRdo;
}
