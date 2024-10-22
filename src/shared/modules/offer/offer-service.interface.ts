import { DocumentType } from '@typegoose/typegoose';

import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';

export interface OfferService {
  find(): Promise<DocumentType<OfferEntity>[]>;
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  findByPremium(): Promise<DocumentType<OfferEntity>[]>;
  // TODO: икремент добавления количества комментария - нужен он?
  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  // findNew(count: number): Promise<DocumentType<OfferEntity>[]>;
  // findDiscussed(count: number): Promise<DocumentType<OfferEntity>[]>;
  exists(documentId: string): Promise<boolean>;
  calculateOfferRating(offerId: string): Promise<DocumentType<OfferEntity> | null>;
}
