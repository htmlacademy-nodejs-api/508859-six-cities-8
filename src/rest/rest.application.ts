import { inject, injectable } from 'inversify';
import express, { Express } from 'express';
import cors from 'cors';

import { Logger } from '../shared/libs/logger/index.js';
import { Config, IRestSchema } from '../shared/libs/config/index.js';
import { COMPONENT } from '../shared/constants/index.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { getFullServerPath, getMongoURI } from '../shared/helpers/index.js';
import { Controller, ExceptionFilter } from '../shared/libs/rest/index.js';
import { ParseTokenMiddleware } from '../shared/libs/rest/middleware/parse-token.middleware.js';
import { STATIC_FILES_ROUTE, STATIC_UPLOAD_ROUTE } from './rest.constant.js';

@injectable()
export class RestApplication {
  private readonly server: Express = express();

  constructor(
    @inject(COMPONENT.LOGGER) private readonly logger: Logger,
    @inject(COMPONENT.CONFIG) private readonly config: Config<IRestSchema>,
    @inject(COMPONENT.DATABASE_CLIENT) private readonly databaseClient: DatabaseClient,
    @inject(COMPONENT.USER_CONTROLLER) private readonly userController: Controller,
    @inject(COMPONENT.AUTH_CONTROLLER) private readonly authController: Controller,
    @inject(COMPONENT.OFFER_CONTROLLER) private readonly offerController: Controller,
    @inject(COMPONENT.COMMENT_CONTROLLER) private readonly commentController: Controller,
    @inject(COMPONENT.EXCEPTION_FILTER) private readonly appExceptionFilter: ExceptionFilter,
    @inject(COMPONENT.AUTH_EXCEPTION_FILTER) private readonly authExceptionFilter: ExceptionFilter,
    @inject(COMPONENT.HTTP_EXCEPTION_FILTER) private readonly httpExceptionFilter: ExceptionFilter,
    @inject(COMPONENT.VALIDATION_EXCEPTION_FILTER) private readonly validationExceptionFilter: ExceptionFilter,
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
    this.server.use('/auth', this.authController.router);
    this.server.use('/users', this.userController.router);
    this.server.use('/offers', this.offerController.router);
    this.server.use('/comments', this.commentController.router);
  }

  private async initMiddleware() {
    const authenticateMiddleware = new ParseTokenMiddleware(this.config.get('JWT_SECRET'));

    this.server.use(express.json());
    this.server.use(
      STATIC_UPLOAD_ROUTE,
      express.static(this.config.get('UPLOAD_DIRECTORY'))
    );
    this.server.use(
      STATIC_FILES_ROUTE,
      express.static(this.config.get('STATIC_DIRECTORY_PATH'))
    );
    this.server.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
    this.server.use(cors());
  }

  private async initExceptionFilters() {
    this.server.use(this.authExceptionFilter.catch.bind(this.authExceptionFilter));
    this.server.use(this.validationExceptionFilter.catch.bind(this.validationExceptionFilter));
    this.server.use(this.httpExceptionFilter.catch.bind(this.httpExceptionFilter));
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

    this.logger.info(
      `Server started on ${getFullServerPath(this.config.get('HOST'), this.config.get('PORT'))}`
    );
  }
}
