import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Middleware } from './middleware.interface.js';
import { DocumentExists } from '../../../types/index.js';
import { HttpError } from '../errors/index.js';

export class DocumentQueryExistsMiddleware implements Middleware {
  constructor(
    private readonly service: DocumentExists,
    private readonly entityName: string,
    private readonly query: string,
  ) {}

  public async execute({ query }: Request, _: Response, next: NextFunction): Promise<void> {
    const documentId = query[this.query];

    if (!documentId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'documentId query param is not valid.',
        'DocumentQueryExistsMiddleware'
      );
    }

    if (! await this.service.exists(String(documentId))) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.entityName} with ${documentId} query not found.`,
        'DocumentQueryExistsMiddleware'
      );
    }

    next();
  }
}
