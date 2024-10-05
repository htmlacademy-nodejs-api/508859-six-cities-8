import 'reflect-metadata';
import { Container } from 'inversify';

import { Logger, PinoLogger } from './shared/libs/logger/index.js';
import { RestApplication } from './rest/index.js';
import { Config, RestConfig, IRestSchema } from './shared/libs/config/index.js';
import { COMPONENT } from './shared/constants/index.js';

// INFO: Точка входа в приложение
async function bootstrap() {
    const container = new Container();
    container.bind<RestApplication>(COMPONENT.REST_APPLICATION).to(RestApplication).inSingletonScope();
    container.bind<Logger>(COMPONENT.LOGGER).to(PinoLogger).inSingletonScope();
    container.bind<Config<IRestSchema>>(COMPONENT.CONFIG).to(RestConfig).inSingletonScope();

    const application = container.get<RestApplication>(COMPONENT.REST_APPLICATION);
    await application.init();
}

bootstrap();