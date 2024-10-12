import { City, ConvenienceType, Coordinate, OfferType } from '../../../types/index.js';

export class CreateOfferDto {
    public title!: string;
    public description!: string;
    public publicationDate!: Date;
    public city!: City;
    public previewImg!: string;
    public images!: string[];
    public isPremium!: boolean;
    public rating!: number;
    public type!: OfferType;
    public flatCount!: number;
    public guestCount!: number;
    public cost!: number;
    public conveniences!: ConvenienceType[];
    public author!: string;
    public commentCount!: number;
    public coordinate!: Coordinate;
}
