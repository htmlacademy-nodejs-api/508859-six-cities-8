import { defaultClasses, getModelForClass, prop, modelOptions } from '@typegoose/typegoose';

import { User, UserType } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';

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
  public firstName!: string;

@prop({ required: true })
public lastName!: string;

@prop({ unique: true, required: true })
public email!: string;

@prop({ default: 'default-avatar.jpg' })
public avatarPath!: string;

@prop({ required: true })
public password!: string;

@prop({ required: true, enum: UserType })
public type!: UserType;

constructor(userData: User) {
  super();

  this.email = userData.email;
  this.avatarPath = userData.avatarPath;
  this.firstName = userData.firstName;
  this.lastName = userData.lastName;
  this.type = userData.type;
}

public setPassword(password: string, salt: string) {
  this.password = createSHA256(password, salt);
}

public getPassword() {
  return this.password;
}
}


export const UserModel = getModelForClass(UserEntity);
