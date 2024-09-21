import { readFileSync } from 'node:fs';

import { FileReader } from './file-reader.interface.js';

import { User, Offer, OfferType, City, ConvenienceType, UserType, Coordinate } from '../../types/index.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  private validateRawData(): void {
    if (! this.rawData) {
      throw new Error('File was not read');
    }
  }

  private parseRawDataToOffers(): Offer[] {
    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length)
      .map((line) => this.parseLineToOffer(line));
  }

  private parseLineToOffer(line: string): Offer {
    const [
      title,
      description,
      publicationDate,
      city,
      previewImg,
      images,
      isPremium,
      rating,
      type,
      flatCount,
      guestCount,
      cost,
      conveniences,
      author,
      commentCount,
      coordinate,
    ] = line.split('\t');

    return {
      title: title || '',
      description: description || '',
      publicationDate: publicationDate ? new Date(publicationDate) : new Date(),
      city: City[city as City],
      previewImg: previewImg || '',
      images: this.parseStringToArray<string[]>(images || ''),
      isPremium: Boolean(isPremium),
      rating: parseInt(rating as string, 10),
      type: type as OfferType,
      flatCount: parseInt(flatCount as string, 10),
      guestCount: parseInt(guestCount as string, 10),
      cost: parseInt(cost as string, 10),
      conveniences: this.parseStringToArray<ConvenienceType[]>(conveniences || ''),
      author: this.parseUser(author || ''),
      commentCount: parseInt(commentCount as string, 10),
      coordinate: this.parseStringToCoordinate(coordinate || '')
    };
  }

  private parseStringToArray<T>(valueStr: string): T {
    return valueStr.split(';') as T;
  }

  private parseStringToCoordinate(valueStr: string): Coordinate {
    const [latitude, longitude] = valueStr.split(';');
    return {
      latitude: parseFloat(latitude as string),
      longitude: parseFloat(longitude as string),
    };
  }

  private parseUser(fullName: string): User {
    const [firstName, lastName] = fullName.split(' ');
    return {
      firstName: firstName || '',
      lastName: lastName || '',
      email: '',
      avatarPath: '',
      password: '',
      type: UserType.REGULAR,
    };
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    this.validateRawData();
    // console.log(this.parseRawDataToOffers());
    return this.parseRawDataToOffers();
  }
}
