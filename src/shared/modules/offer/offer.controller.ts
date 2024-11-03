import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { BaseController, DocumentExistsMiddleware, HttpError, HttpMethod, RequestQuery, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { COMPONENT } from '../../constants/component.constant.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/common.js';
import { FullOfferRdo } from './rdo/full-offer.rdo.js';
import { StatusCodes } from 'http-status-codes';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { DEFAULT_OFFER_COUNT, MAX_OFFER_COUNT } from './offer.constant.js';
import { IdOfferRdo } from './rdo/id-offer.rdo.js';
import { ParamOfferId } from './type/param-offerid.type.js';
import { CreateOfferRequest } from './type/create-offer-request.type.js';
import { CommentService } from '../comment/index.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';

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
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateOfferDto)]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')]
    });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Patch, handler: this.update, middlewares: [new ValidateObjectIdMiddleware('offerId'), new ValidateDtoMiddleware(UpdateOfferDto), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')] });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.delete, middlewares: [new ValidateObjectIdMiddleware('offerId'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')] });
  }

  public async index({ query } : Request<unknown, unknown, unknown, RequestQuery>, res: Response): Promise<void> {
    // TODO: Опционально сделать middleware для limit (опционально)
    const limitNum = Number(query?.limit);
    const limit = query?.limit && !Number.isNaN(limitNum) && limitNum < MAX_OFFER_COUNT ? limitNum : DEFAULT_OFFER_COUNT;

    // TODO: Временно сделать const userId = '<ID>';
    // const userId = req.user.id // AFTER JWT

    if (!Number.isSafeInteger(limit)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Limit param is not correct.',
        'OfferController'
      );
    }

    const offers = await this.offerService.find(limit);

    const responseData = fillDTO(FullOfferRdo, offers);
    this.ok(res, responseData);
  }

  public async create(
    { body }: CreateOfferRequest,
    res: Response
  ): Promise<void> {

    // -? Как проверить что данные пользователя верные?

    // const existOffer = await this.offerService.findByCategoryName(body.name);

    // if (existCategory) {
    //   const existCategoryError = new Error(`Category with name «${body.name}» exists.`);
    // throw new HttpError(
    // StatusCodes.UNPROCESSABLE_ENTITY,
    // `Category with name «${body.name}» exists.`,
    // 'CategoryController'
    // );
    //   this.send(res,
    //     StatusCodes.UNPROCESSABLE_ENTITY,
    //     { error: existCategoryError.message }
    //   );

    //   return this.logger.error(existCategoryError.message, existCategoryError);
    // }

    // TODO: доработать валидацию на 400-ую ошибку
    // -? получаем ли мы здесь расширинного автора
    const result = await this.offerService.create(body);
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
