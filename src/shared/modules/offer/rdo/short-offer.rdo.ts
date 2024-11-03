import { Expose, Transform } from 'class-transformer';
import { City, OfferType } from '../../../types/index.js';

export class ShortOfferRdo {
  @Expose()
  @Transform((params) => params.obj._id.toString())
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
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

  // TODO: Через агрегацию добавляешь поле isFavorite, через агрегацию проверяешь
  // TODO: есть ли id этого оффера
  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public commentCount!: number;
}
