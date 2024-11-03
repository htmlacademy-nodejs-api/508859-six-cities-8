import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';

import { OfferService } from './offer-service.interface.js';
import { Logger } from '../../libs/logger/index.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { COMPONENT } from '../../constants/component.constant.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { DEFAULT_PREMIUM_OFFER_COUNT } from './offer.constant.js';
import { SortType } from '../../types/sort-type.enum.js';
import { Types } from 'mongoose';
import { authorAggregation } from './offer.aggregation.js';
import { OfferEntity } from '../../entities/index.js';
// import { CommentService } from '../comment/index.js';
// import { UserService } from '../user/user-service.interface.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(COMPONENT.LOGGER) private readonly logger: Logger,
    @inject(COMPONENT.OFFER_MODEL) private readonly offerModel: types.ModelType<OfferEntity>,
    // @inject(COMPONENT.COMMENT_SERVICE) private readonly commentService: CommentService
  ) {}

  // TODO: Возвращать не больше 60 предложений об аренде - SUCCESS
  // TODO: Клиент может запросить больше указав нужное количество - SUCCESS
  // TODO: Отсортированный список по дате публикации - SUCCESS
  // TODO: Добавить и рассчитать динамически флаг избранного предложения
  public async find(limit: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .aggregate([
        ...authorAggregation,
        { $limit: limit },
        { $sort: { createdAt: SortType.DESC }}
      ])
      // .find({}, {}, { limit })
      // // .limit(limit)

      // // expose декоратор rename
      // // .aggregate(offerAggregation)
      // .populate(['author'])
      .exec();
  }

  // TODO: Закрыть от неавторизированных пользователей
  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create({...dto, rating: 0 });
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  // TODO: Закрыть от неавторизированных пользователей
  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, {new: true})
      .populate(['userId'])
      .exec();
  }

  // TODO: Удалять вместо с предложением комментарии авторматически
  // TODO: Закрыть от неавторизированных пользователей
  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  // TODO: Добавить и рассчитать динамически флаг избранного предложения
  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const data = await this.offerModel.aggregate([
      { $match: { '_id': new Types.ObjectId(offerId) } },
      ...authorAggregation
    ])
      .exec();

    return data[0] || null;
    // .findById(offerId) // { $match: { '_id': new Types.ObjectId(offerId) } }

    // .populate(['author'])
  }

  // TODO: Проверить метод
  public async findByPremium(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ isPremium: true }, {}, { limit: DEFAULT_PREMIUM_OFFER_COUNT })
      .sort({ publicationDate: SortType.DESC });
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {
        '$inc': {
          commentCount: 1,
        }
      }).exec();
  }

  public async calculateOfferRating(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, {
      // '$avg': {
      //   rating: 1,
      // }
      '$group': {
        _id: '$',
        averageQty: { $avg: '$' },
      },
    }).exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return this.offerModel.exists({_id: documentId}).then((r) => !!r);
  }


  public async findFavoritesByUserId(userId: string): Promise<DocumentType<OfferEntity>[]> {
    console.log('userId', userId);
    return this.offerModel
      .aggregate([
        ...authorAggregation,
      ])
      .exec();
  }

  // console.log("user", user);

  // const favoritesIds = user.favorites.map((item: Types.ObjectId) => ({ _id: item }));
  // const user = await this.userService.findById(userId);
  // const offers = user.favorites.map(() => await this.);
  // console.log("user", user);
  // { $match: { 'author': new Types.ObjectId(userId) } },

  // public async findNew(count: number): Promise<DocumentType<OfferEntity>[]> {
  //   return this.offerModel
  //     .find()
  //     .sort({ createdAt: SortType.Down })
  //     .limit(count)
  //     .populate(['userId', 'categories'])
  //     .exec();
  // }

  // public async findDiscussed(count: number): Promise<DocumentType<OfferEntity>[]> {
  //   return this.offerModel
  //     .find()
  //     .sort({ commentCount: SortType.Down })
  //     .limit(count)
  //     .populate(['userId', 'categories'])
  //     .exec();
  // }
}
