import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { UserService } from './user-service.interface.js';
import { DefaultUserService } from './default-user.service.js';
import { COMPONENT } from '../../constants/component.constant.js';
// import { UserEntity, UserModel } from './user.entity.js';
import { Controller } from '../../libs/rest/index.js';
import { UserController } from './user.controller.js';
import { UserEntity, UserModel } from '../../entities/index.js';

export function createUserContainer() {
  const userContainer = new Container();
  userContainer.bind<types.ModelType<UserEntity>>(COMPONENT.USER_MODEL).toConstantValue(UserModel);
  userContainer.bind<UserService>(COMPONENT.USER_SERVICE).to(DefaultUserService).inSingletonScope();
  userContainer.bind<Controller>(COMPONENT.USER_CONTROLLER).to(UserController).inSingletonScope();
  return userContainer;
}
