import { DocumentType } from '@typegoose/typegoose';

import { CreateCommentDTO } from './dto/create-comment.dto.js';
import { CommentEntity } from '../../entities/index.js';

export interface CommentService {
  create(dto: CreateCommentDTO & { userId: string }): Promise<DocumentType<CommentEntity>>;
  findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]>;
  deleteByOfferId(offerId: string): Promise<number | null>;
}
