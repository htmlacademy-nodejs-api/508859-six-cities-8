import { NextFunction, Request, Response } from 'express';
import { jwtVerify } from 'jose';
import { StatusCodes } from 'http-status-codes';

import { createSecretKey } from 'node:crypto';

import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/index.js';
import { TokenPayload } from '../../../modules/auth/index.js';

export class ParseTokenMiddleware implements Middleware {
  constructor(private readonly jwtSecret: string) {}

  private isTokenPayload(payload: unknown): payload is TokenPayload {
    return (
      (typeof payload === 'object' && payload !== null) &&
      ('sub' in payload && typeof payload.sub === 'string')
    );
  }

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authorizationHeader = req.headers?.authorization?.split(' ') || [];
    
    if (!authorizationHeader.length) {
      return next();
    }

    const [, token] = authorizationHeader;

    try {
      const { payload } = await jwtVerify(String(token), createSecretKey(this.jwtSecret, 'utf-8'));

      if (this.isTokenPayload(payload)) {
        req.tokenPayload = { ...payload };
        return next();
      } else {
        throw new Error('Bad token');
      }
    } catch {

      return next(new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid token',
        'AuthenticateMiddleware')
      );
    }
  }
}
