import 'reflect-metadata';
import { Container } from 'inversify';

import { createRestApplicationContainer } from './rest/rest.container.js';
import { createUserContainer } from './shared/modules/user/index.js';
import { createOfferContainer } from './shared/modules/offer/index.js';
import { createCommentContainer } from './shared/modules/comment/index.js';
import { RestApplication } from './rest/index.js';
import { COMPONENT } from './shared/constants/index.js';

// INFO: Точка входа в приложение
async function bootstrap() {
  const appContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createOfferContainer(),
    createCommentContainer(),
  );

  const application = appContainer.get<RestApplication>(COMPONENT.REST_APPLICATION);
  await application.init();
}

bootstrap();
