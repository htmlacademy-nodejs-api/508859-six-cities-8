import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';

import { UserService } from './user-service.interface.js';

import { Logger } from '../../libs/logger/index.js';
import { COMPONENT } from '../../constants/index.js';
import { UpdateUserDTO } from './dto/update-user.dto.js';
import { OfferEntity, UserEntity } from '../../entities/index.js';
import { OfferService } from '../offer/offer-service.interface.js';
import { Types } from 'mongoose';
import { CreateUserDTO } from './dto/create-user.dto.js';

@injectable()
export class DefaultUserService implements UserService {

  constructor(
        @inject(COMPONENT.LOGGER) private readonly logger: Logger,
        @inject(COMPONENT.USER_MODEL) private readonly userModel: types.ModelType<UserEntity>,
        @inject(COMPONENT.OFFER_SERVICE) private readonly offerService: OfferService
  ) {}

  public async create(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto, dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async exists(documentId: string): Promise<boolean> {
    return this.userModel.exists({_id: documentId}).then((r) => !!r);
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }


  public async findById(userId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findById(userId);
  }


  public async findOrCreate(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public async updateById(userId: string, dto: UpdateUserDTO): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(userId, dto, { new: true })
      .exec();
  }

  public async findFavoritesForUser(userId: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerService.findFavoritesByUserId(userId);
  }

  public async addFavorite(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findByIdAndUpdate(userId, { $addToSet: { favorites: new Types.ObjectId(offerId) } }, { new: true }).exec();
  }

  public async deleteFavorite(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findByIdAndUpdate(userId, { $pull: { favorites: new Types.ObjectId(offerId) } }, { new: true }).exec();
  }
}
