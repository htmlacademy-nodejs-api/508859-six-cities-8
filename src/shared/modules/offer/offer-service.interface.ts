import { DocumentType } from '@typegoose/typegoose';

import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { OfferEntity } from '../../entities/index.js';
import { City, DocumentExists } from '../../types/index.js';

export interface OfferService extends DocumentExists {
  find(count?: number): Promise<DocumentType<OfferEntity>[]>;
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  findByPremium(city: City): Promise<DocumentType<OfferEntity>[]>;
  // TODO: икремент добавления количества комментария - нужен он?
  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  // -? как правильно типизировать
  findFavoritesByUserId(userId: string): Promise<DocumentType<OfferEntity>[]>;
  exists(documentId: string): Promise<boolean>;
  calculateOfferRating(offerId: string): Promise<DocumentType<OfferEntity> | null>;
}
