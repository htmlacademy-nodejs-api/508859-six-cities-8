import { DocumentType } from '@typegoose/typegoose';

import { CreateOfferDTO } from './dto/create-offer.dto.js';
import { UpdateOfferDTO } from './dto/update-offer.dto.js';
import { OfferEntity } from '../../entities/index.js';
import { City, DocumentExists } from '../../types/index.js';

export interface OfferService extends DocumentExists {
  find(count?: number, userId?: string): Promise<DocumentType<OfferEntity>[]>;
  create(dto: CreateOfferDTO & { userId: string }): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null>;
  findBySimpleId(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, dto: UpdateOfferDTO & { userId: string }): Promise<DocumentType<OfferEntity> | null>;
  findByPremium(city: City, userId?: string): Promise<DocumentType<OfferEntity>[]>;
  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findFavoritesByUserId(userId: string): Promise<DocumentType<OfferEntity>[]>;
  exists(documentId: string): Promise<boolean>;
}
