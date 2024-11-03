import { Expose, Transform } from 'class-transformer';

export class IdOfferRdo {
  @Expose()
  @Transform((params) => params.obj._id.toString())
  public id!: string;
}
