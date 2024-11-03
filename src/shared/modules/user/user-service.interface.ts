import { DocumentType } from '@typegoose/typegoose';

import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { OfferEntity, UserEntity } from '../../entities/index.js';
import { DocumentExists } from '../../types/document-exists.interface.js';

export interface UserService extends DocumentExists {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findById(userId: string): Promise<DocumentType<UserEntity> | null>;
  updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null>;
  findFavoritesForUser(userId: string): Promise<DocumentType<OfferEntity>[]>;
  addFavorite(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null>;
  deleteFavorite(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null>;
}
