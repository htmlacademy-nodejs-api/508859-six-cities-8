import { Expose, Type } from 'class-transformer';

import { UserRdo } from '../../user/rdo/user.rdo.js';

export class CommentRdo {
  // TODO: Выводить корректный id
  // @Transform(t => t.toString())
  @Expose()
  public id!: string;

  @Expose()
  public text!: string;

  @Expose({ name: 'createdAt' })
  public publicationDate!: string;

  @Expose({ name: 'userId'})
  @Type(() => UserRdo)
  public user!: UserRdo;
}
