import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { StatusCodes } from 'http-status-codes';

import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/index.js';

export class ValidateObjectIdMiddleware implements Middleware {
  constructor(private param: string) {}

  public execute({ params }: Request, _: Response, next: NextFunction): void {
    const objectId = params[this.param];

    if (Types.ObjectId.isValid(String(objectId))) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `${objectId} is invalid ObjectID`,
      'ValidateObjectIdMiddleware'
    );
  }
}
