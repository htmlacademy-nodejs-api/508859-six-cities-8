import { City } from './city.enum.js';
import { ConvenienceType } from './convenience.type.js';
import { Coordinate } from './coordinate.type.js';
import { OfferType } from './offer-type.enum.js';

export interface MockServerData {
    titles: string[],
    descriptions: string[],
    publicationDates: Date[],
    cities: City[],
    previewImgs: string[],
    images: string[],
    isPremuimArr: boolean[],
    ratings: number[],
    types: OfferType[],
    flatCounts: number[],
    guestCounts: number[],
    costs: number[],
    conveniences: ConvenienceType[],
    authors: string[],
    commentCounts: number[],
    coordinates: Coordinate[]
}
