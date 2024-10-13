import { inject, injectable } from 'inversify';

import { Logger } from '../shared/libs/logger/index.js';
import { Config, IRestSchema } from '../shared/libs/config/index.js';
import { COMPONENT } from '../shared/constants/index.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoURI } from '../shared/helpers/index.js';
import { UserModel } from '../shared/modules/user/index.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(COMPONENT.LOGGER) private readonly logger: Logger,
    @inject(COMPONENT.CONFIG) private readonly config: Config<IRestSchema>,
    @inject(COMPONENT.DATABASE_CLIENT) private readonly databaseClient: DatabaseClient,
  ) {}

  private async initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    return this.databaseClient.connect(mongoUri);
  }

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    this.logger.info('Init database…');
    await this.initDb();
    this.logger.info('Init database completed');

    const user = await UserModel.create({
      email: 'ilkolmakov@yandex.ru',
      avatarPath: 'keks.jpg',
      firstname: 'Keks',
      lastname: 'Unknown'
    });

    const error = user.validateSync();
    console.log(error);

    //  console.log(user);
  }
}
