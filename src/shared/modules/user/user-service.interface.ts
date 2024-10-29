import { DocumentType } from '@typegoose/typegoose';

// import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserEntity } from '../../entities/index.js';

export interface UserService {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findById(userId: string): Promise<DocumentType<UserEntity> | null>;
  updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null>;
  findFavoritesForUser(userId: string): Promise<DocumentType<UserEntity> | null>;
  addFavorite(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null>;
  deleteFavorite(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null>;
}
