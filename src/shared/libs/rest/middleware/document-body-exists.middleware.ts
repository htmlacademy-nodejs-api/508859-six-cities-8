import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Middleware } from './middleware.interface.js';
import { DocumentExists } from '../../../types/index.js';
import { HttpError } from '../errors/index.js';

export class DocumentBodyExistsMiddleware implements Middleware {
  constructor(
    private readonly service: DocumentExists,
    private readonly entityName: string,
    private readonly objectFieldName: string,
  ) {}

  public async execute({ body }: Request, _: Response, next: NextFunction): Promise<void> {
    const documentId = body[this.objectFieldName];

    if (!documentId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'documentId with body is not valid.',
        'DocumentBodyExistsMiddleware'
      );
    }

    if (! await this.service.exists(String(documentId))) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.entityName} with ${documentId} with body not found.`,
        'DocumentBodyExistsMiddleware'
      );
    }

    next();
  }
}
