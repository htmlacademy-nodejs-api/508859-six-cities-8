import { Container } from 'inversify';

import { AuthService } from './auth-service.interface.js';
import { DefaultAuthService } from './default-auth.service.js';
import { ExceptionFilter } from '../../libs/rest/index.js';
import { AuthExceptionFilter } from './auth.exception-filter.js';
import { COMPONENT } from '../../constants/component.constant.js';

export function createAuthContainer() {
  const authContainer = new Container();
  authContainer.bind<AuthService>(COMPONENT.AUTH_SERVICE).to(DefaultAuthService).inSingletonScope();
  authContainer.bind<ExceptionFilter>(COMPONENT.AUTH_EXCEPTION_FILTER).to(AuthExceptionFilter).inSingletonScope();

  return authContainer;
}
