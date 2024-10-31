import { inject, injectable } from 'inversify';
import express, { Express } from 'express';

import { Logger } from '../shared/libs/logger/index.js';
import { Config, IRestSchema } from '../shared/libs/config/index.js';
import { COMPONENT } from '../shared/constants/index.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoURI } from '../shared/helpers/index.js';
import { Controller, ExceptionFilter } from '../shared/libs/rest/index.js';

@injectable()
export class RestApplication {
  private readonly server: Express = express();

  constructor(
    @inject(COMPONENT.LOGGER) private readonly logger: Logger,
    @inject(COMPONENT.CONFIG) private readonly config: Config<IRestSchema>,
    @inject(COMPONENT.DATABASE_CLIENT) private readonly databaseClient: DatabaseClient,
    @inject(COMPONENT.OFFER_CONTROLLER) private readonly offerController: Controller,
    @inject(COMPONENT.EXCEPTION_FILTER) private readonly appExceptionFilter: ExceptionFilter,
    @inject(COMPONENT.USER_CONTROLLER) private readonly userController: Controller,
    @inject(COMPONENT.COMMENT_CONTROLLER) private readonly commentController: Controller,
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

  private async initServer() {
    const port = this.config.get('PORT');
    this.server.listen(port);
  }

  private async initControllers() {
    this.server.use('/offers', this.offerController.router);
    this.server.use('/users', this.userController.router);
    this.server.use('/comments', this.commentController.router);
  }

  private async initMiddleware() {
    this.server.use(express.json());
  }

  private async initExceptionFilters() {
    this.server.use(this.appExceptionFilter.catch.bind(this.appExceptionFilter));
  }

  public async init() {
    this.logger.info('Application initialization');

    this.logger.info('Init database…');
    await this.initDb();
    this.logger.info('Init database completed');

    this.logger.info('Init app-level middleware');
    await this.initMiddleware();
    this.logger.info('App-level middleware initialization completed');

    this.logger.info('Init controllers');
    await this.initControllers();
    this.logger.info('Controller initialization completed');

    this.logger.info('Init exception filters');
    await this.initExceptionFilters();
    this.logger.info('Exception filters initialization compleated');

    this.logger.info('Try to init server…');
    await this.initServer();
    // TODO:  Нужно найти как правильно брать протокол
    this.logger.info(
      `Server started on http://${this.config.get('DB_HOST')}:${this.config.get('PORT')}`
    );
  }
}
