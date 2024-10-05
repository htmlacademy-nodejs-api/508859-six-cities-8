import { config } from 'dotenv';
import { inject, injectable } from 'inversify';

import { Config } from './config.interface.js';
import { Logger } from '../logger/index.js';
import { configRestSchema } from './rest.schema.js';
import { IRestSchema } from './rest.schema.interface.js';
import { COMPONENT } from '../../constants/index.js';

@injectable()
export class RestConfig implements Config<IRestSchema> {
  private readonly config: IRestSchema;

  constructor(
        @inject(COMPONENT.LOGGER) private readonly logger: Logger
  ) {
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Can\'t read .env file. Perhaps the file does not exists.');
    }

    configRestSchema.load({});
    configRestSchema.validate({ allowed: 'strict', output: this.logger.info });

    this.config = configRestSchema.getProperties();
    this.logger.info('.env file found and successfully parsed!');
  }

  public get<T extends keyof IRestSchema>(key: T): IRestSchema[T] {
    return this.config[key];
  }
}
