import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';

import { CommentService } from './comment-service.interface.js';
// import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { COMPONENT } from '../../constants/component.constant.js';
import { SortType } from '../../types/sort-type.enum.js';
import { DEFAULT_COMMENT_COUNT } from './comment.constant.js';
import { OfferService } from '../offer/offer-service.interface.js';
import { CommentEntity } from '../../entities/index.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(COMPONENT.COMMENT_MODEL) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(COMPONENT.OFFER_SERVICE) private readonly offerService: OfferService
  ) {}

  // TODO: Добавить вывод 50 или меньше последних комментариев - SUCCESS
  // TODO: Комментарии отсортированы по дате публикации от нового к старому
  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({offerId}, {}, { limit: DEFAULT_COMMENT_COUNT })
      .sort({ createdAt: SortType.DESC })
      .populate('userId');
  }

  // TODO: Закрыть от неавторизированных пользователей
  // INFO: Добавить перерасчет при добавлении комментария
  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);

    await this.offerService.calculateOfferRating(String(comment.userId));
    return comment.populate('userId');
  }

  // TODO: Ручка удаления комментариев вместе с предложениями
  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({offerId})
      .exec();

    return result.deletedCount;
  }
}
