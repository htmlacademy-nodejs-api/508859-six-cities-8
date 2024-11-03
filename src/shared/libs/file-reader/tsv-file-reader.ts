import EventEmitter from 'node:events';
import { createReadStream } from 'node:fs';

import { FileReader } from './file-reader.interface.js';

import { User, Offer, OfferType, City, ConvenienceType, UserType, Coordinate } from '../../types/index.js';
import { DECIMAL_RADIX, ENCODING_DEFAULT } from '../../constants/index.js';

export class TSVFileReader extends EventEmitter implements FileReader {
  private CHUNK_SIZE = 16384;

  constructor(
    private readonly filename: string
  ) {
    super();
  }

  // INFO: Разбор строки на отдельный сущности предложения
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
      userId,
      commentCount,
      coordinate,
    ] = line.split('\t');

    return {
      title: title || '',
      description: description || '',
      publicationDate: publicationDate ? new Date(publicationDate) : new Date(),
      city: City[city as City],
      previewImg: previewImg || '',
      images: this.parseStringToArray<string>(images || '', ','),
      isPremium: Boolean(isPremium),
      rating: parseInt(rating as string, DECIMAL_RADIX),
      type: type as OfferType,
      flatCount: parseInt(flatCount as string, DECIMAL_RADIX),
      guestCount: parseInt(guestCount as string, DECIMAL_RADIX),
      cost: parseInt(cost as string, DECIMAL_RADIX),
      conveniences: this.parseStringToArray<ConvenienceType>(conveniences || '', ','),
      user: this.parseUser(userId || ''),
      commentCount: parseInt(commentCount as string, DECIMAL_RADIX),
      coordinate: this.parseStringToCoordinate(coordinate || '')
    };
  }

  private parseStringToArray<T>(valueStr: string, separator: string): T[] {
    return valueStr.split(separator) as T[];
  }

  private parseStringToCoordinate(valueStr: string): Coordinate {
    const [latitude, longitude] = valueStr.split(';');
    return {
      latitude: parseFloat(latitude as string),
      longitude: parseFloat(longitude as string),
    };
  }

  private parseUser(userName: string): User {
    // const [firstName, lastName] = fullName.split(' ');
    return {
      // firstName: firstName || '',
      // lastName: lastName || '',
      userName,
      email: '',
      avatarPath: '',
      password: '',
      type: UserType.REGULAR,
    };
  }

  // INFO: Метод импорта из файла
  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      highWaterMark: this.CHUNK_SIZE,
      encoding: ENCODING_DEFAULT,
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        const parsedOffer = this.parseLineToOffer(completeRow);
        await new Promise((resolve) => {
          this.emit('line', parsedOffer, resolve);
        });
      }
    }
    this.emit('end', importedRowCount);
  }
}
