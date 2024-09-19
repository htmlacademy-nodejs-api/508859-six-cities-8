import { City } from './city.enum.js';
import { ConvenienceType } from './convenience.type.js';
import { Coordinate } from './coordinate.type.js';
import { OfferType } from './offer-type.enum.js';
import { User } from './user.interface.js';

export interface Offer {
  title: string;
  description: string;
  publicationDate: Date;
  city: City;
  previewImg: string;
  images: string[];
  isPremium: boolean;
  rating: number;
  type: OfferType;
  flatCount: number;
  guestCount: number;
  cost: number;
  conveniences: ConvenienceType[];
  author: User;
  commentCount: number;
  coordinate: Coordinate;
}