import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { BaseController, DocumentBodyExistsMiddleware, DocumentQueryExistsMiddleware, HttpMethod, PrivateRouteMiddleware, ValidateDtoMiddleware, ValidateObjectIdQueryMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { CommentService } from './comment-service.interface.js';
import { OfferService } from '../offer/index.js';
import { fillDTO } from '../../helpers/index.js';
import { CommentRdo } from './rdo/comment.rdo.js';
import { CreateCommentRequest } from './types/create-comment-request.type.js';
import { COMPONENT } from '../../constants/index.js';
import { RequestQueryComment } from './types/request-query-comment.type.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

@injectable()
export default class CommentController extends BaseController {
  constructor(
    @inject(COMPONENT.LOGGER) protected readonly logger: Logger,
    @inject(COMPONENT.COMMENT_SERVICE) private readonly commentService: CommentService,
    @inject(COMPONENT.OFFER_SERVICE) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController');
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCommentDto),
        // ?- Спросить необходимость инжектировать сервис для проверки в контроллере
        new DocumentBodyExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/', method:
      HttpMethod.Get,
      handler: this.index,
      middlewares: [
        new ValidateObjectIdQueryMiddleware('offerId'),
        // ?- Спросить необходимость инжектировать сервис для проверки в контроллере
        new DocumentQueryExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
  }

  public async index({ query }: Request<unknown, unknown, unknown, RequestQueryComment>, res: Response): Promise<void> {
    const offerId = String(query.offerId);

    const comments = await this.commentService.findByOfferId(offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async create(
    { body, tokenPayload }: CreateCommentRequest,
    res: Response
  ): Promise<void> {
    const comment = await this.commentService.create({ ...body, userId: tokenPayload.id });

    await this.offerService.incCommentCount(body.offerId);

    this.created(res, fillDTO(CommentRdo, comment));
  }
}
