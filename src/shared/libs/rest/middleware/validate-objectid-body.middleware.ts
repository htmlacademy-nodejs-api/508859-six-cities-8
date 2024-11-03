import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { StatusCodes } from 'http-status-codes';

import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/index.js';

export class ValidateObjectIdBodyMiddleware implements Middleware {
  constructor(private objectFieldName: string) {}

  public execute({ body }: Request, _res: Response, next: NextFunction): void {
    const objectId = body[this.objectFieldName];

    if (Types.ObjectId.isValid(String(objectId))) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `${objectId} is invalid body field ObjectID`,
      'ValidateObjectIdBodyMiddleware'
    );
  }
}