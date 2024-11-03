import { IsArray, IsEnum, IsInt, IsObject, IsOptional, Max, MaxLength, Min, MinLength, ValidateNested } from 'class-validator';
import { City, ConvenienceType, Coordinate, OfferType } from '../../../types/index.js';
import { Type } from 'class-transformer';
import { CoordinateDTO } from './coordinate.dto.js';
import { OFFER_DTO_CONSTRAINTS } from '../offer.constant.js';

export class UpdateOfferDto {
  @IsOptional()
  @MinLength(OFFER_DTO_CONSTRAINTS.TITLE.MIN_LENGTH)
  @MaxLength(OFFER_DTO_CONSTRAINTS.TITLE.MAX_LENGTH)
  public title?: string;

  @IsOptional()
  @MinLength(OFFER_DTO_CONSTRAINTS.DESCRIPTION.MIN_LENGTH)
  @MaxLength(OFFER_DTO_CONSTRAINTS.DESCRIPTION.MAX_LENGTH)
  public description?: string;

  @IsOptional()
  @IsEnum(City)
  public city?: City;

  @IsOptional()
  public previewImg?: string;

  @IsOptional()
  public images?: string[];

  @IsOptional()
  public isPremium?: boolean;

  @IsOptional()
  @IsEnum(OfferType)
  public type?: OfferType;

  @IsOptional()
  @IsInt()
  @Min(OFFER_DTO_CONSTRAINTS.FLAT_COUNT.MIN_VALUE)
  @Max(OFFER_DTO_CONSTRAINTS.FLAT_COUNT.MAX_VALUE)
  public flatCount?: number;

  @IsOptional()
  @IsInt()
  @Min(OFFER_DTO_CONSTRAINTS.GUEST_COUNT.MIN_VALUE)
  @Max(OFFER_DTO_CONSTRAINTS.GUEST_COUNT.MAX_VALUE)
  public guestCount?: number;

  @IsOptional()
  @IsInt()
  @Min(OFFER_DTO_CONSTRAINTS.COST.MIN_VALUE)
  @Max(OFFER_DTO_CONSTRAINTS.COST.MAX_VALUE)
  public cost?: number;

  @IsOptional()
  @IsArray()
  // @IsEnum({ each: true, message: UPDATE_OFFER_VALIDATION_MESSAGE.CONVENIENCES.invalid })
  public conveniences?: ConvenienceType[];

  @IsOptional()
  @ValidateNested()
  @IsObject()
  @Type(() => CoordinateDTO)
  public coordinate?: Coordinate;
}
