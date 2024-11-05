import { inject, injectable} from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';

import { OfferService } from './offer-service.interface.js';
import { CreateOfferDTO } from './dto/create-offer.dto.js';
import { COMPONENT } from '../../constants/component.constant.js';
import { UpdateOfferDTO } from './dto/update-offer.dto.js';
import { MAX_PREMIUM_OFFER_COUNT } from './offer.constant.js';
import { SortType } from '../../types/sort-type.enum.js';
import { Types } from 'mongoose';
import { authorAggregation, commentAggregation, favoriteAggregation } from './offer.aggregation.js';
import { OfferEntity } from '../../entities/index.js';
import { City } from '../../types/city.enum.js';
import { CommentService } from '../comment/index.js';
import { Logger } from '../../libs/logger/index.js';


@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(COMPONENT.LOGGER) private readonly logger: Logger,
    @inject(COMPONENT.OFFER_MODEL) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(COMPONENT.COMMENT_SERVICE) private readonly commentService: CommentService,
  ) {}

  public async find(limit: number, userId: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .aggregate([
        ...authorAggregation,
        ...favoriteAggregation(userId),
        { $limit: limit },
        { $sort: { createdAt: SortType.DESC }}
      ])
      .exec();
  }

  public async create(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create({...dto, rating: 0 });
    this.logger.info(`New offer created: ${dto.title}`);

    return result.populate('userId');
  }

  public async updateById(offerId: string, dto: UpdateOfferDTO): Promise<DocumentType<OfferEntity> | null> {
    const result = await this.offerModel
      .findByIdAndUpdate(offerId, dto, {new: true});

    return result!.populate('userId');
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {

    await this.commentService.deleteByOfferId(offerId);

    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async findById(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null> {
    const data = await this.offerModel.aggregate([
      { $match: { '_id': new Types.ObjectId(offerId) } },
      ...commentAggregation,
      ...authorAggregation,
      ...favoriteAggregation(userId, offerId),
    ]).exec();

    return data[0] || null;
  }

  public async findByPremium(city: City, userId: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.aggregate([
      { $match: {
        city,
        isPremium: true,
      } },
      ...commentAggregation,
      ...favoriteAggregation(userId),
      { $sort: { createdAt: SortType.DESC } },
      { $limit: MAX_PREMIUM_OFFER_COUNT },
    ]);
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {
        '$inc': {
          commentCount: 1,
        }
      }).exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return this.offerModel.exists({_id: documentId}).then((r) => !!r);
  }


  public async findFavoritesByUserId(userId: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .aggregate([
        ...authorAggregation,
        ...favoriteAggregation(userId),
        { $match: { isFavorite: true }}
      ])
      .exec();
  }
}
