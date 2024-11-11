import { CityName, Type, Location } from '../../types/types';

export class UpdateOfferDTO {
  public title?: string;

  public description?: string;

  public city?: CityName;

  public previewImg?: string;

  public images?: string[];

  public isPremium?: boolean;

  public type?: Type;

  public flatCount?: number;

  public guestCount?: number;

  public cost?: number;

  public conveniences?: string[];

  public coordinate?: Location;
}
