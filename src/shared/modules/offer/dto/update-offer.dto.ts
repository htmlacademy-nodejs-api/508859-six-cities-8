import { IsArray, IsEnum, IsInt, IsObject, IsOptional, Max, MaxLength, Min, MinLength } from 'class-validator';
import { City, ConvenienceType, Coordinate, OfferType } from '../../../types/index.js';
import { UPDATE_OFFER_VALIDATION_MESSAGE } from './update-offer.messages.js';

export class UpdateOfferDto {
  @IsOptional()
  @MinLength(10, { message: UPDATE_OFFER_VALIDATION_MESSAGE.TITLE.minLength })
  @MaxLength(100, { message: UPDATE_OFFER_VALIDATION_MESSAGE.TITLE.maxLength })
  public title?: string;

  @IsOptional()
  @MinLength(20, { message: UPDATE_OFFER_VALIDATION_MESSAGE.TITLE.minLength })
  @MaxLength(1024, { message: UPDATE_OFFER_VALIDATION_MESSAGE.TITLE.maxLength })
  public description?: string;

  @IsOptional()
  @IsEnum(City, { message: UPDATE_OFFER_VALIDATION_MESSAGE.CITY.invalid })
  public city?: City;

  @IsOptional()
  public previewImg?: string;

  @IsOptional()
  public images?: string[];

  @IsOptional()
  public isPremium?: boolean;

  @IsOptional()
  @IsEnum(OfferType, { message: UPDATE_OFFER_VALIDATION_MESSAGE.OFFER_TYPE.invalid })
  @Min(1, { message: UPDATE_OFFER_VALIDATION_MESSAGE.FLAT_COUNT.minValue })
  @Max(8, { message: UPDATE_OFFER_VALIDATION_MESSAGE.FLAT_COUNT.maxValue })
  public type?: OfferType;

  @IsOptional()
  @IsInt({ message: UPDATE_OFFER_VALIDATION_MESSAGE.FLAT_COUNT.invalidFormat })
  @Min(1, { message: UPDATE_OFFER_VALIDATION_MESSAGE.FLAT_COUNT.minValue })
  @Max(8, { message: UPDATE_OFFER_VALIDATION_MESSAGE.FLAT_COUNT.maxValue })
  public flatCount?: number;

  @IsOptional()
  @IsInt({ message: UPDATE_OFFER_VALIDATION_MESSAGE.GUEST_COUNT.invalidFormat })
  @Min(1, { message: UPDATE_OFFER_VALIDATION_MESSAGE.GUEST_COUNT.minValue })
  @Max(10, { message: UPDATE_OFFER_VALIDATION_MESSAGE.GUEST_COUNT.maxValue })
  public guestCount?: number;

  @IsOptional()
  @IsInt({ message: UPDATE_OFFER_VALIDATION_MESSAGE.COST.invalidFormat })
  @Min(100, { message: UPDATE_OFFER_VALIDATION_MESSAGE.COST.minValue })
  @Max(100000, { message: UPDATE_OFFER_VALIDATION_MESSAGE.COST.maxValue })
  public cost?: number;

  @IsOptional()
  @IsArray({ message: UPDATE_OFFER_VALIDATION_MESSAGE.CONVENIENCES.invalidFormat })
  // @IsEnum({ each: true, message: UPDATE_OFFER_VALIDATION_MESSAGE.CONVENIENCES.invalid })
  public conveniences?: ConvenienceType[];

  @IsOptional()
  @IsObject({ })
  public coordinate?: Coordinate;
}
