import {
  defaultClasses,
  modelOptions,
  prop,
  Ref
} from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { UserEntity } from './user.entity.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CommentEntity extends defaultClasses.Base {}

  @modelOptions({
    schemaOptions: {
      collection: 'comments',
      timestamps: true,
    }
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CommentEntity extends defaultClasses.TimeStamps {
    @prop({ trim: true, required: true })
  public text!: string;

    @prop({ required: true })
    public rating!: number;

    @prop({
      ref: () => OfferEntity,
      required: true
    })
    public offerId!: Ref<OfferEntity>;

    @prop({
      ref: () => UserEntity,
      required: true,
    })
    public author!: Ref<UserEntity>;
}
