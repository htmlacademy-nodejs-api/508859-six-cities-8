import { defaultClasses, prop, modelOptions, Ref } from '@typegoose/typegoose';
import { User, UserType } from '../types/index.js';
import { createSHA256 } from '../helpers/index.js';
import { OfferEntity } from './offer.entity.js';
import { DEFAULT_USER_AVATAR } from '../constants/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {

@prop({ required: true })
  public userName!: string;

@prop({ unique: true, required: true })
public email!: string;

@prop({ default: DEFAULT_USER_AVATAR })
public avatarPath?: string;

@prop({ required: true })
public password!: string;

@prop({ required: true, enum: UserType })
public type!: UserType;

@prop({
  ref: () => OfferEntity,
  default: [],
})
public favorites?: Ref<OfferEntity>[];

constructor(userData: User, password: string, salt: string) {
  super();

  this.email = userData.email;
  this.avatarPath = userData.avatarPath;
  this.userName = userData.userName;
  this.type = userData.type;


  this.setPassword(password, salt);
}

public setPassword(password: string, salt: string) {
  this.password = createSHA256(password, salt);
}

public verifyPassword(password: string, salt: string) {
  const hashPassword = createSHA256(password, salt);
  return hashPassword === this.password;
}

public getPassword() {
  return this.password;
}
}
