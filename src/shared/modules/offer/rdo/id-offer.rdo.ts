import { Expose, Transform } from 'class-transformer';

export class IdOfferRDO {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  public id!: string;
}
