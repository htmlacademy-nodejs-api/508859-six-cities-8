import dayjs from 'dayjs';

import { OfferGenerator } from './offer-generator.interface.js';
import { City, Coordinate, MockServerData, OfferType } from '../../types/index.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/index.js';
import { FIRST_WEEK_DAY, LAST_WEEK_DAY } from '../../constants/index.js';

// INFO: Класс генерации предложений на основе данных из запроса для получения моковых данных
export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}
  // INFO: В методе `generate` напишем код для формирования случайного объявления
  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const publicationDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();
    const city = getRandomItem<City>(this.mockData.cities);
    const previewImg = getRandomItem<string>(this.mockData.previewImgs);
    const images = getRandomItems<string>(this.mockData.images).join(';');
    const isPremium = String(this.mockData.isPremuimArr[generateRandomValue(0, 1)]);
    const rating = getRandomItem<number>(this.mockData.ratings).toString();
    const type = getRandomItem<OfferType>(this.mockData.types).toString();
    const flatCount = getRandomItem<number>(this.mockData.flatCounts).toString();
    const guestCount = getRandomItem<number>(this.mockData.guestCounts).toString();
    const cost = getRandomItem<number>(this.mockData.costs).toString();
    const conveniences = getRandomItems(this.mockData.conveniences).join(';');
    const user = getRandomItem(this.mockData.users);
    const commentCount = getRandomItem<number>(this.mockData.commentCounts).toString();
    const coordinate = getRandomItem<Coordinate>(this.mockData.coordinates);

    const currentCoordinate = `${coordinate.latitude};${coordinate.longitude}`;

    return [
      title, description, publicationDate,
      city, previewImg, images, isPremium, rating,
      type, flatCount, guestCount, cost, conveniences,
      user, commentCount, currentCoordinate
    ].join('\t');
  }
}
