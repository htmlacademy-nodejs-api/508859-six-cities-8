import { getModelForClass } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { UserEntity } from './user.entity.js';
import { CommentEntity } from './comment.entity.js';

export const OfferModel = getModelForClass(OfferEntity);
export const UserModel = getModelForClass(UserEntity);
export const CommentModel = getModelForClass(CommentEntity);

export { OfferEntity, UserEntity, CommentEntity };
