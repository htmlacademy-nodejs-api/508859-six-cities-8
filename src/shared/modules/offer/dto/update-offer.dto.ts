import { City, ConvenienceType, Coordinate, OfferType } from '../../../types/index.js';

export class UpdateOfferDto {
  public title?: string;
  public description?: string;
  public city?: City;
  public previewImg?: string;
  public images?: string[];
  public isPremium?: boolean;
  public rating?: number;
  public type?: OfferType;
  public flatCount?: number;
  public guestCount?: number;
  public cost?: number;
  public conveniences?: ConvenienceType[];
  public coordinate?: Coordinate;
}
