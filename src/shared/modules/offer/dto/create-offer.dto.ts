import { IsArray, IsEnum, IsInt, IsObject, Max, MaxLength, Min, MinLength } from 'class-validator';

import { City, ConvenienceType, Coordinate, OfferType } from '../../../types/index.js';
import { CREATE_OFFER_VALIDATION_MESSAGE } from './create-offer.messages.js';

export class CreateOfferDto {
  @MinLength(10, { message: CREATE_OFFER_VALIDATION_MESSAGE.TITLE.minLength })
  @MaxLength(100, { message: CREATE_OFFER_VALIDATION_MESSAGE.TITLE.maxLength })
  public title!: string;

  @MinLength(20, { message: CREATE_OFFER_VALIDATION_MESSAGE.TITLE.minLength })
  @MaxLength(1024, { message: CREATE_OFFER_VALIDATION_MESSAGE.TITLE.maxLength })
  public description!: string;

  @IsEnum(City, { message: CREATE_OFFER_VALIDATION_MESSAGE.CITY.invalid })
  public city!: City;

  public previewImg!: string;

  // TODO: 6 фотографий всегда
  public images!: string[];

  // TODO: булево значение
  public isPremium!: boolean;

  @IsEnum(OfferType, { message: CREATE_OFFER_VALIDATION_MESSAGE.OFFER_TYPE.invalid })
  public type!: OfferType;

  @IsInt({ message: CREATE_OFFER_VALIDATION_MESSAGE.FLAT_COUNT.invalidFormat })
  @Min(1, { message: CREATE_OFFER_VALIDATION_MESSAGE.FLAT_COUNT.minValue })
  @Max(8, { message: CREATE_OFFER_VALIDATION_MESSAGE.FLAT_COUNT.maxValue })
  public flatCount!: number;

  @IsInt({ message: CREATE_OFFER_VALIDATION_MESSAGE.GUEST_COUNT.invalidFormat })
  @Min(1, { message: CREATE_OFFER_VALIDATION_MESSAGE.GUEST_COUNT.minValue })
  @Max(10, { message: CREATE_OFFER_VALIDATION_MESSAGE.GUEST_COUNT.maxValue })
  public guestCount!: number;

  @IsInt({ message: CREATE_OFFER_VALIDATION_MESSAGE.COST.invalidFormat })
  @Min(100, { message: CREATE_OFFER_VALIDATION_MESSAGE.COST.minValue })
  @Max(100000, { message: CREATE_OFFER_VALIDATION_MESSAGE.COST.maxValue })
  public cost!: number;

  @IsArray({ message: CREATE_OFFER_VALIDATION_MESSAGE.CONVENIENCES.invalidFormat })
  // @IsEnum({ each: true, message: CREATE_OFFER_VALIDATION_MESSAGE.CONVENIENCES.invalid })
  public conveniences!: ConvenienceType[];

  // TODO: Как указываем объекты
  @IsObject({ })
  public coordinate!: Coordinate;

  // @IsMongoId({ message: CREATE_OFFER_VALIDATION_MESSAGE.AUTHOR.invalidId })
  public author?: string;

  // // @IsDateString({}, { message: CREATE_OFFER_VALIDATION_MESSAGE.PUBLICATION_DATE.invalidFormat })
  // public publicationDate?: Date;

  public commentCount?: number;
}
