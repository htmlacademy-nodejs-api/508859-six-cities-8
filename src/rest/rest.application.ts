import { inject, injectable } from 'inversify';

import { Logger } from '../shared/libs/logger/index.js';
import { Config, IRestSchema } from '../shared/libs/config/index.js';
import { COMPONENT } from '../shared/constants/index.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(COMPONENT.LOGGER) private readonly logger: Logger,
    @inject(COMPONENT.CONFIG) private readonly config: Config<IRestSchema>,
  ) {}

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);
  }
}
