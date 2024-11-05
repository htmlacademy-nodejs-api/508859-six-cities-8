import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { 
  BaseController, 
  DocumentBodyExistsMiddleware, 
  DocumentExistsMiddleware, 
  HttpError, 
  HttpMethod, 
  PrivateRouteMiddleware, 
  UploadFileMiddleware, 
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { COMPONENT } from '../../constants/index.js';
import { UserService } from './user-service.interface.js';
import { Config, IRestSchema } from '../../libs/config/index.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../helpers/index.js';
import { OfferService, ShortOfferRDO } from '../offer/index.js';
import { ParamOfferId } from '../../types/index.js';
import { AddFavoriteRequest } from './types/add-favorite-request.type.js';

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

    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.findFavoritesForUser,
      middlewares: [new PrivateRouteMiddleware()]
    });
    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Post,
      handler: this.addFavoriteForUser,
      middlewares: [
        new PrivateRouteMiddleware(),
        new DocumentBodyExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/favorites/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteFavoriteForUser,
      middlewares: [
        new PrivateRouteMiddleware(),
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

  public async findFavoritesForUser({ tokenPayload }: Request, res: Response) {
    const userId = tokenPayload?.sub;

    const currentUser = await this.userService.findById(userId);

    if (!currentUser) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with id ${userId} not found.`,
        'UserController',
      );
    }

    const offers = await this.userService.findFavoritesForUser(userId);
    this.ok(res, fillDTO(ShortOfferRDO, offers));
  }

  public async addFavoriteForUser({ body, tokenPayload }: AddFavoriteRequest, res: Response) {
    const offerId = body?.offerId;
    const userId = tokenPayload?.sub;

    const favoriteList = await this.userService.findFavoritesForUser(userId);

    if (favoriteList.map((item) => item._id.toString()).includes(offerId)) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Offer ${offerId} is already in favorites`,
        'UserController',
      );
    }

    const updatedUser = await this.userService.addFavorite(userId, offerId);
    this.noContent(res, updatedUser);
  }

  public async deleteFavoriteForUser({ params, tokenPayload }: Request<ParamOfferId>, res: Response) {
    const { offerId } = params;

    const userId = tokenPayload?.sub;

    if (!offerId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'OfferId is required field',
        'UserController',
      );
    }

    const existsUser = await this.userService.findById(userId);

    if (!existsUser) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with id ${userId} not found.`,
        'UserController',
      );
    }

    const updatedUser = await this.userService.deleteFavorite(userId, offerId);
    this.noContent(res, updatedUser);
  }

  public async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path
    });
  }
}
