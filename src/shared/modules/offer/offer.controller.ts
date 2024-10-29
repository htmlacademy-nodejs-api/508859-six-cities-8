import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
// import { StatusCodes } from 'http-status-codes';

import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { COMPONENT } from '../../constants/component.constant.js';
import { OfferService } from './offer-service.interface.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { ShortOfferRdo } from './rdo/short-offer.rdo.js';
import { fillDTO } from '../../helpers/common.js';
import { FullOfferRdo } from './rdo/full-offer.rdo.js';
import { StatusCodes } from 'http-status-codes';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { DEFAULT_OFFER_COUNT } from './offer.constant.js';
import { IdOfferRdo } from './rdo/id-offer.rdo.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(COMPONENT.LOGGER) protected readonly logger: Logger,
    @inject(COMPONENT.OFFER_SERVICE) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/:id', method: HttpMethod.Get, handler: this.show });
    this.addRoute({ path: '/:id', method: HttpMethod.Patch, handler: this.update });
    this.addRoute({ path: '/:id', method: HttpMethod.Delete, handler: this.delete });
  }

  public async index(req: Request, res: Response): Promise<void> {
    const limit = req.query.limit ? Number(req.query.limit) : DEFAULT_OFFER_COUNT;

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

    const responseData = fillDTO(ShortOfferRdo, offers);
    this.ok(res, responseData);
  }

  public async create(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
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
    this.created(res, fillDTO(FullOfferRdo, result));
  }

  public async show(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const isOfferExists = await this.offerService.exists(id);

    if (!isOfferExists) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id «${id}» not exists.`,
        'OfferController'
      );
    }

    const currentOffer = await this.offerService.findById(id);

    const responseData = fillDTO(FullOfferRdo, currentOffer);
    this.ok(res, responseData);
  }

  public async update(
    req: Request<Record<string, unknown>, Record<string, unknown>, UpdateOfferDto>,
    res: Response
  ): Promise<void> {
    const id = String(req.params.id);
    const isOfferExists = await this.offerService.exists(id);

    if (!isOfferExists) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id «${id}» not exists.`,
        'OfferController'
      );
    }

    const currentOffer = await this.offerService.updateById(id, req.body);
    const responseData = fillDTO(FullOfferRdo, currentOffer);
    this.ok(res, responseData);
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const isOfferExists = await this.offerService.exists(id);

    if (!isOfferExists) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id «${id}» not exists.`,
        'OfferController'
      );
    }

    const deletedOffer = await this.offerService.deleteById(id);
    const responseData = fillDTO(IdOfferRdo, deletedOffer);
    this.ok(res, responseData);
  }
}
