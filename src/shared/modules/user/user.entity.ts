import { defaultClasses, getModelForClass, prop, modelOptions } from '@typegoose/typegoose';

import { User, UserType } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
    schemaOptions: {
      collection: 'users',
      timestamps: true,
    }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {

@prop({ required: true, default: '' })
public firstName!: string;

@prop({ required: true, default: '' })
public lastName!: string;

@prop({ unique: true, required: true })
public email!: string;

@prop({ required: true, default: '' })
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