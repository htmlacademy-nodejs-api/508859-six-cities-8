import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { CreateUserRequest } from './create-user-request.type.js';
import { COMPONENT } from '../../constants/index.js';
import { UserService } from './user-service.interface.js';
import { Config, IRestSchema } from '../../libs/config/index.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../helpers/index.js';
import { UserRdo } from './rdo/user.rdo.js';
import { LoginUserRequest } from './login-user-request.type.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(COMPONENT.LOGGER) protected readonly logger: Logger,
    @inject(COMPONENT.USER_SERVICE) private readonly userService: UserService,
    @inject(COMPONENT.CONFIG) private readonly configService: Config<IRestSchema>,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');
    
    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.login });
    this.addRoute({ path: '/login', method: HttpMethod.Get, handler: this.showStatus });
    this.addRoute({ path: '/:userId/favorites', method: HttpMethod.Get, handler: this.showUserFavorites });
    this.addRoute({ path: '/:userId/favorites', method: HttpMethod.Post, handler: this.addFavoriteForUser });
    this.addRoute({ path: '/:userId/favorites', method: HttpMethod.Delete, handler: this.deleteFavoriteForUser });
  }
  
  // -? как идет проверка на статус, вошел ли пользователь в систему
  public async showStatus(): Promise<void> {
    throw new HttpError(
        StatusCodes.NOT_IMPLEMENTED,
        'Not implemented',
        'UserController',
    );
  }

  public async create(
    { body }: CreateUserRequest,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login(
    { body }: LoginUserRequest,
    _: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (! existsUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found.`,
        'UserController',
      );
    }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController',
    );
  }

  public async showUserFavorites(req: Request, res: Response) {
    const { userId } = req.params;

    const existsUser = await this.userService.findById(String(userId));

    if (!existsUser) {
        throw new HttpError(
            StatusCodes.NOT_FOUND,
            `User with id ${userId} not found.`,
            'UserController',
        );
    }

    const user = await this.userService.findFavoritesForUser(String(userId));
    this.ok(res, fillDTO(UserRdo, user));
  }
 

  // TODO: Можно написать DTO для params
  public async addFavoriteForUser(req: Request, res: Response) {
    const { userId } = req.params;
    const { offerId } = req.body;

    if (!offerId) {
        throw new HttpError(
            StatusCodes.BAD_REQUEST,
            `OfferId is required field`,
            'UserController',
        );
    }

    const existsUser = await this.userService.findById(String(userId));

    if (!existsUser) {
        throw new HttpError(
            StatusCodes.NOT_FOUND,
            `User with id ${userId} not found.`,
            'UserController',
        );
    }

    const updatedUser = await this.userService.addFavorite(String(userId), offerId);
    this.ok(res, fillDTO(UserRdo, updatedUser));
  }

  public async deleteFavoriteForUser(req: Request, res: Response) {
    const { userId } = req.params;
    const { offerId } = req.body;

    if (!offerId) {
        throw new HttpError(
            StatusCodes.BAD_REQUEST,
            `OfferId is required field`,
            'UserController',
        );
    }

    const existsUser = await this.userService.findById(String(userId));

    if (!existsUser) {
        throw new HttpError(
            StatusCodes.NOT_FOUND,
            `User with id ${userId} not found.`,
            'UserController',
        );
    }

    const updatedUser = await this.userService.deleteFavorite(String(userId), offerId);
    this.ok(res, fillDTO(UserRdo, updatedUser));
  }
}