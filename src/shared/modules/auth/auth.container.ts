import { Container } from 'inversify';

import { AuthService } from './auth-service.interface.js';
import { DefaultAuthService } from './default-auth.service.js';
import { Controller, ExceptionFilter } from '../../libs/rest/index.js';
import { AuthExceptionFilter } from './auth.exception-filter.js';
import { COMPONENT } from '../../constants/component.constant.js';
import { AuthController } from './auth.controller.js';

export function createAuthContainer() {
  const authContainer = new Container();
  authContainer.bind<AuthService>(COMPONENT.AUTH_SERVICE).to(DefaultAuthService).inSingletonScope();
  authContainer.bind<ExceptionFilter>(COMPONENT.AUTH_EXCEPTION_FILTER).to(AuthExceptionFilter).inSingletonScope();
  authContainer.bind<Controller>(COMPONENT.AUTH_CONTROLLER).to(AuthController).inSingletonScope();

  return authContainer;
}
