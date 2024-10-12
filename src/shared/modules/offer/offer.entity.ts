import {
    defaultClasses,
    getModelForClass,
    modelOptions,
    prop,
    Ref
  } from '@typegoose/typegoose';
  
  import { City, ConvenienceType, Coordinate, OfferType } from '../../types/index.js';
  import { UserEntity } from '../user/index.js';
  
  export interface OfferEntity extends defaultClasses.Base {}
  
  @modelOptions({
    schemaOptions: {
      collection: 'offers',
      timestamps: true,
    }
  })
  export class OfferEntity extends defaultClasses.TimeStamps {
    @prop({ trim: true, required: true })
    public title!: string;
  
    @prop({ trim: true })
    public description!: string;
  
    @prop()
    public publicationDate!: Date;
  
    @prop({ enum: City })
    public city!: City;
  
    @prop()
    public previewImg!: number;
    
    @prop()
    public images!: string[];
    
    @prop()
    public isPremium!: boolean;
    
    @prop()
    public rating!: number;

    @prop({
      type: () => String,
      enum: OfferType
    })
    public type!: OfferType;

    @prop()
    public flatCount!: number;

    @prop()
    public guestCount!: number;

    @prop()
    public cost!: number;

    @prop()
    public conveniences!: ConvenienceType;

    @prop({
      ref: () => UserEntity,
      required: true
    })
    public author!: Ref<UserEntity>; // userId

    @prop({default: 0})
    public commentCount!: number;
    
    @prop()
    public coordinate!: Coordinate;
  }
  
  export const OfferModel = getModelForClass(OfferEntity);
