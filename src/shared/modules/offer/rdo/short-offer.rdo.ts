import { Expose, Transform } from 'class-transformer';
import { City, OfferType } from '../../../types/index.js';

export class ShortOfferRDO {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  public id!: string;

  @Expose()
  public title!: string;

  @Expose({ name: 'createdAt' })
  public publicationDate!: Date;

  @Expose()
  public city!: City;

  @Expose()
  public previewImg!: string;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public type!: OfferType;

  @Expose()
  public cost!: number;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public commentCount!: number;
}
