import { Expose } from 'class-transformer';
import { City, OfferType } from '../../../types/index.js';

export class ShortOfferRdo {
  @Expose()
  public id!: string; // -? указывам ли идентификатор

  @Expose()
  public title!: string;

  @Expose()
  public publicationDate!: Date;

  @Expose()
  public city!: City; // -? строка или тип

  @Expose()
  public previewImg!: string;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public type!: OfferType; // -? строка или тип

  @Expose()
  public cost!: number;

  // TODO: Через агрегацию добавляешь поле isFavorite, через агрегацию проверяешь
  // TODO: есть ли id этого оффера
  @Expose()
  public isFavorite!: boolean; // -? указываем при получении

  @Expose()
  public commentCount!: number;
}
