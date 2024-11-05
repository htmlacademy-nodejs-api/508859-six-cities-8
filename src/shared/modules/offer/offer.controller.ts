import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { BaseController, DocumentExistsMiddleware, HttpError, HttpMethod, PrivateRouteMiddleware, RequestQuery, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { COMPONENT } from '../../constants/component.constant.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/common.js';
import { FullOfferRDO } from './rdo/full-offer.rdo.js';
import { StatusCodes } from 'http-status-codes';
import { UpdateOfferDTO } from './dto/update-offer.dto.js';
import { DEFAULT_OFFER_COUNT, MAX_OFFER_COUNT } from './offer.constant.js';
import { IdOfferRDO } from './rdo/id-offer.rdo.js';
import { CreateOfferRequest } from './types/create-offer-request.type.js';
import { CreateOfferDTO } from './dto/create-offer.dto.js';
import { ShortOfferRDO } from './rdo/short-offer.rdo.js';
import { RequestPremiumQuery } from './types/request-premium-query.type.js';
import { City } from '../../types/city.enum.js';
import { ParamOfferId } from '../../types/index.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(COMPONENT.LOGGER) protected readonly logger: Logger,
    @inject(COMPONENT.OFFER_SERVICE) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/premium', method: HttpMethod.Get, handler: this.findPremium });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new PrivateRouteMiddleware(), new ValidateDtoMiddleware(CreateOfferDTO)]
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
        new ValidateDtoMiddleware(UpdateOfferDTO),
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

  public async index({ query, tokenPayload } : Request<unknown, unknown, unknown, RequestQuery>, res: Response): Promise<void> {
    const limitNum = Number(query?.limit);
    const limit = query?.limit && !Number.isNaN(limitNum) && limitNum < MAX_OFFER_COUNT ? limitNum : DEFAULT_OFFER_COUNT;
    const userId = tokenPayload?.sub;


    if (!Number.isSafeInteger(limit)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Limit param is not correct.',
        'OfferController'
      );
    }

    const offers = await this.offerService.find(limit, userId);

    const responseData = fillDTO(ShortOfferRDO, offers);
    this.ok(res, responseData);
  }

  public async findPremium({ query, tokenPayload }: Request<unknown, unknown, unknown, RequestPremiumQuery>, res: Response): Promise<void> {
    const city = query?.city;
    const userId = tokenPayload?.sub;

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
    const offers = await this.offerService.findByPremium(city as City, userId);

    const responseData = fillDTO(ShortOfferRDO, offers);
    this.ok(res, responseData);
  }

  public async create(
    { body, tokenPayload }: CreateOfferRequest,
    res: Response
  ): Promise<void> {
    const result = await this.offerService.create({...body, userId: tokenPayload?.sub });
    this.created(res, fillDTO(FullOfferRDO, result));
  }

  public async show({ params, tokenPayload }: Request<ParamOfferId>, res: Response): Promise<void> {
    const offerId = String(params?.offerId);
    const userId = tokenPayload?.sub;

    const currentOffer = await this.offerService.findById(offerId, userId);

    const responseData = fillDTO(FullOfferRDO, currentOffer);
    this.ok(res, responseData);
  }

  public async update(
    { body, params, tokenPayload }: Request<ParamOfferId, unknown, UpdateOfferDTO>,
    res: Response
  ): Promise<void> {
    const offerId = String(params?.offerId);
    const updatedOffer = await this.offerService.updateById(offerId, {...body, userId: tokenPayload?.sub });

    const responseData = fillDTO(FullOfferRDO, updatedOffer);
    this.ok(res, responseData);
  }

  public async delete({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const offerId = String(params?.offerId);
    const deletedOffer = await this.offerService.deleteById(offerId);

    const responseData = fillDTO(IdOfferRDO, deletedOffer);
    this.ok(res, responseData);
  }
}
