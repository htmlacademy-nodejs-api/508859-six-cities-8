import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { BaseController, DocumentExistsMiddleware, HttpError, HttpMethod, PrivateRouteMiddleware, RequestQuery, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { COMPONENT } from '../../constants/component.constant.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/common.js';
import { FullOfferRdo } from './rdo/full-offer.rdo.js';
import { StatusCodes } from 'http-status-codes';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { DEFAULT_OFFER_COUNT, MAX_OFFER_COUNT } from './offer.constant.js';
import { IdOfferRdo } from './rdo/id-offer.rdo.js';
import { CreateOfferRequest } from './types/create-offer-request.type.js';
import { CommentService } from '../comment/index.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { ShortOfferRdo } from './rdo/short-offer.rdo.js';
import { RequestPremiumQuery } from './types/request-premium-query.type.js';
import { City } from '../../types/city.enum.js';
import { ParamOfferId } from '../../types/index.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(COMPONENT.LOGGER) protected readonly logger: Logger,
    @inject(COMPONENT.OFFER_SERVICE) private readonly offerService: OfferService,
    @inject(COMPONENT.COMMENT_SERVICE) private readonly commentService: CommentService // TODO: Убрать!
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/premium', method: HttpMethod.Get, handler: this.findPremium });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new PrivateRouteMiddleware(), new ValidateDtoMiddleware(CreateOfferDto)]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ] });
  }

  public async index({ query } : Request<unknown, unknown, unknown, RequestQuery>, res: Response): Promise<void> {
    // TODO: Опционально сделать middleware для limit (опционально)
    const limitNum = Number(query?.limit);
    const limit = query?.limit && !Number.isNaN(limitNum) && limitNum < MAX_OFFER_COUNT ? limitNum : DEFAULT_OFFER_COUNT;

    if (!Number.isSafeInteger(limit)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Limit param is not correct.',
        'OfferController'
      );
    }

    const offers = await this.offerService.find(limit);

    const responseData = fillDTO(ShortOfferRdo, offers);
    this.ok(res, responseData);
  }

  public async findPremium({ query }: Request<unknown, unknown, unknown, RequestPremiumQuery>, res: Response): Promise<void> {
    const city = query?.city;

    if (!city) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'City in query is not correct.',
        'OfferController'
      );
    }

    if (!(city in City)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'City in query not included in the list of available cities.',
        'OfferController'
      );
    }
    const offers = await this.offerService.findByPremium(city);

    const responseData = fillDTO(ShortOfferRdo, offers);
    this.ok(res, responseData);
  }

  public async create(
    { body, tokenPayload }: CreateOfferRequest,
    res: Response
  ): Promise<void> {
    // -? получаем ли мы здесь расширинного автора
    const result = await this.offerService.create({...body, userId: tokenPayload.id });
    const offer = await this.offerService.findById(result.id);
    this.created(res, fillDTO(FullOfferRdo, offer));
  }

  public async show({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const offerId = String(params?.offerId);

    const currentOffer = await this.offerService.findById(offerId);

    const responseData = fillDTO(FullOfferRdo, currentOffer);
    this.ok(res, responseData);
  }

  public async update(
    { body, params }: Request<ParamOfferId, unknown, UpdateOfferDto>,
    res: Response
  ): Promise<void> {
    const offerId = String(params?.offerId);
    const updatedOffer = await this.offerService.updateById(offerId, body);

    const responseData = fillDTO(FullOfferRdo, updatedOffer);
    this.ok(res, responseData);
  }

  public async delete({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    // TODO: Переопределять request (опционально)
    const offerId = String(params?.offerId);
    const deletedOffer = await this.offerService.deleteById(offerId);
    // -? Circular dependency found: Symbol(kRestApplication) --> Symbol(kOfferController) --> Symbol(kOfferService) --> Symbol(kCommentService) --> Symbol(kOfferService)
    await this.commentService.deleteByOfferId(offerId);

    const responseData = fillDTO(IdOfferRdo, deletedOffer);
    this.ok(res, responseData);
  }
}
