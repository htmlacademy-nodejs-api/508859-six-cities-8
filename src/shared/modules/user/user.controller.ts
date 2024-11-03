import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { BaseController, DocumentBodyExistsMiddleware, DocumentExistsMiddleware, HttpError, HttpMethod, UploadFileMiddleware, ValidateDtoMiddleware, ValidateObjectIdBodyMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { CreateUserRequest } from './create-user-request.type.js';
import { COMPONENT } from '../../constants/index.js';
import { UserService } from './user-service.interface.js';
import { Config, IRestSchema } from '../../libs/config/index.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../helpers/index.js';
import { UserRdo } from './rdo/user.rdo.js';
import { LoginUserRequest } from './login-user-request.type.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { OfferService, ShortOfferRdo } from '../offer/index.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(COMPONENT.LOGGER) protected readonly logger: Logger,
    @inject(COMPONENT.USER_SERVICE) private readonly userService: UserService,
    @inject(COMPONENT.OFFER_SERVICE) private readonly offerService: OfferService,
    @inject(COMPONENT.CONFIG) private readonly configService: Config<IRestSchema>,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController');

    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.create, middlewares: [new ValidateDtoMiddleware(CreateUserDto)] });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.login, middlewares: [new ValidateDtoMiddleware(LoginUserDto)] });
    this.addRoute({ path: '/login', method: HttpMethod.Get, handler: this.showStatus });
    this.addRoute({ path: '/favorites', method: HttpMethod.Get, handler: this.showUserFavorites, middlewares: [] });
    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Post,
      handler: this.addFavoriteForUser,
      middlewares: [
        new ValidateObjectIdBodyMiddleware('offerId'),
        new DocumentBodyExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    // -? Нужно спросить необходимость инжектировать сервис для проверки
    this.addRoute({
      path: '/favorites/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteFavoriteForUser,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatarPath'),
      ]
    });
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

  // TODO: Закрыть от неавторизированных пользователей
  public async showUserFavorites(_: Request, res: Response) {
    // TODO: Токен берется из токена авторизации
    const mockUserId = '67152f430ace5d6726f44745';

    const currentUser = await this.userService.findById(mockUserId);

    if (!currentUser) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with id ${mockUserId} not found.`,
        'UserController',
      );
    }

    const offers = await this.userService.findFavoritesForUser(mockUserId);
    this.ok(res, fillDTO(ShortOfferRdo, offers));
  }


  // TODO: Можно написать DTO для params
  // TODO: Закрыть от неавторизированных пользователей
  public async addFavoriteForUser(req: Request, res: Response) {
    const { offerId } = req.body;

    // TODO: Не можем добавлять одни и те же офферы в избранное
    // if (favorites.map((item) => item._id.toString()).includes(params.offerId)) {
    //   throw new HttpError(
    //     StatusCodes.CONFLICT,
    //     `Offer ${params.offerId} is already in favorites`,
    //     'UserController',
    //   );
    // }

    const mockUserId = '67152f430ace5d6726f44745';

    if (!offerId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'OfferId is required field',
        'UserController',
      );
    }

    const existsUser = await this.userService.findById(mockUserId);

    if (!existsUser) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with id ${mockUserId} not found.`,
        'UserController',
      );
    }

    const updatedUser = await this.userService.addFavorite(mockUserId, offerId);
    this.noContent(res, updatedUser);
  }

  // TODO: Закрыть от неавторизированных пользователей
  public async deleteFavoriteForUser(req: Request, res: Response) {
    const { offerId } = req.params;

    const mockUserId = '67152f430ace5d6726f44745';

    if (!offerId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'OfferId is required field',
        'UserController',
      );
    }

    const existsUser = await this.userService.findById(mockUserId);

    if (!existsUser) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with id ${mockUserId} not found.`,
        'UserController',
      );
    }

    const updatedUser = await this.userService.deleteFavorite(mockUserId, offerId);
    this.noContent(res, updatedUser);
  }

  public async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path
    });
  }
}
