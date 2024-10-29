import { Container } from 'inversify';

import { RestApplication } from './rest.application.js';
// import { Component } from '../shared/types/index.js';
import { Logger, PinoLogger } from '../shared/libs/logger/index.js';
import { Config, IRestSchema, RestConfig } from '../shared/libs/config/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../shared/libs/database-client/index.js';
import { COMPONENT } from '../shared/constants/index.js';
import { AppExceptionFilter, ExceptionFilter } from '../shared/libs/rest/index.js';

export function createRestApplicationContainer() {
  const restApplicationContainer = new Container();

  restApplicationContainer.bind<RestApplication>(COMPONENT.REST_APPLICATION).to(RestApplication).inSingletonScope();
  restApplicationContainer.bind<Logger>(COMPONENT.LOGGER).to(PinoLogger).inSingletonScope();
  restApplicationContainer.bind<Config<IRestSchema>>(COMPONENT.CONFIG).to(RestConfig).inSingletonScope();
  restApplicationContainer.bind<DatabaseClient>(COMPONENT.DATABASE_CLIENT).to(MongoDatabaseClient).inSingletonScope();
  restApplicationContainer.bind<ExceptionFilter>(COMPONENT.EXCEPTION_FILTER).to(AppExceptionFilter).inSingletonScope();
  
  return restApplicationContainer;
}
