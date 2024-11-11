import { CityName, Type } from '../../types/types';

export class ShortOfferDTO {
  public id!: string;

  public title!: string;

  public publicationDate!: Date;

  public city!: CityName;

  public previewImg!: string;

  public isPremium!: boolean;

  public rating!: number;

  public type!: Type;

  public cost!: number;

  public isFavorite!: boolean;

  public commentCount!: number;
}
