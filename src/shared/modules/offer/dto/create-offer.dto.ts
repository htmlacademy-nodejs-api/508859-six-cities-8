import { IsArray, IsBoolean, IsEnum, IsInt, IsObject, Max, MaxLength, Min, MinLength, ValidateNested } from 'class-validator';

import { City, ConvenienceType, Coordinate, OfferType } from '../../../types/index.js';
import { Type } from 'class-transformer';
import { CoordinateDTO } from './coordinate.dto.js';
import { OFFER_DTO_CONSTRAINTS } from '../offer.constant.js';

export class CreateOfferDto {
  @MinLength(OFFER_DTO_CONSTRAINTS.TITLE.MIN_LENGTH)
  @MaxLength(OFFER_DTO_CONSTRAINTS.TITLE.MAX_LENGTH)
  public title!: string;

  @MinLength(OFFER_DTO_CONSTRAINTS.DESCRIPTION.MIN_LENGTH)
  @MaxLength(OFFER_DTO_CONSTRAINTS.DESCRIPTION.MAX_LENGTH)
  public description!: string;

  @IsEnum(City)
  public city!: City;

  public previewImg!: string;

  // TODO: 6 фотографий всегда
  public images!: string[];

  @IsBoolean()
  public isPremium!: boolean;

  @IsEnum(OfferType)
  public type!: OfferType;

  @IsInt()
  @Min(OFFER_DTO_CONSTRAINTS.FLAT_COUNT.MIN_VALUE)
  @Max(OFFER_DTO_CONSTRAINTS.FLAT_COUNT.MAX_VALUE)
  public flatCount!: number;

  @IsInt()
  @Min(OFFER_DTO_CONSTRAINTS.GUEST_COUNT.MIN_VALUE)
  @Max(OFFER_DTO_CONSTRAINTS.GUEST_COUNT.MAX_VALUE)
  public guestCount!: number;

  @IsInt()
  @Min(OFFER_DTO_CONSTRAINTS.COST.MIN_VALUE)
  @Max(OFFER_DTO_CONSTRAINTS.COST.MAX_VALUE)
  public cost!: number;

  @IsArray()
  // @IsEnum({ each: true, message: CREATE_OFFER_VALIDATION_MESSAGE.CONVENIENCES.invalid })
  public conveniences!: ConvenienceType[];

  @ValidateNested()
  @IsObject()
  @Type(() => CoordinateDTO)
  public coordinate!: Coordinate;

  // @IsMongoId({ message: CREATE_OFFER_VALIDATION_MESSAGE.AUTHOR.invalidId })
  public userId?: string;
}
