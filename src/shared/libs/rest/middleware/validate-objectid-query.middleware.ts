import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { StatusCodes } from 'http-status-codes';

import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/index.js';

export class ValidateObjectIdQueryMiddleware implements Middleware {
  constructor(private query: string) {}

  public execute({ query }: Request, _: Response, next: NextFunction): void {
    const objectId = query[this.query];

    if (Types.ObjectId.isValid(String(objectId))) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `${objectId} is invalid query ObjectID`,
      'ValidateObjectIdQueryMiddleware'
    );
  }
}
