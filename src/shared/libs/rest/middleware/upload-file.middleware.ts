import { NextFunction, Request, Response } from 'express';
import multer, { diskStorage } from 'multer';
import { extension } from 'mime-types';

import * as crypto from 'node:crypto';

import { Middleware } from './middleware.interface.js';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../index.js';
import { IMAGE_EXTENSIONS } from '../../../constants/index.js';

export class UploadFileMiddleware implements Middleware {
  constructor(
    private uploadDirectory: string,
    private fieldName: string,
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_, file, callback) => {
        const fileExtention = extension(file.mimetype);
        const filename = crypto.randomUUID();
        callback(null, `${filename}.${fileExtention}`);
      }
    });

    const fileFilter = (
      _: Request,
      file: Express.Multer.File,
      callback: multer.FileFilterCallback,
    ) => {
      const fileExtention = file.originalname.split('.').pop();
      if (fileExtention && !IMAGE_EXTENSIONS.includes(fileExtention)) {
        return callback(new HttpError(
          StatusCodes.BAD_REQUEST,
          'Invalid file extension',
          'UploadFileMiddleware',
        ));
      }
      return callback(null, true);
    };

    const uploadSingleFileMiddleware = multer({ storage, fileFilter })
      .single(this.fieldName);

    uploadSingleFileMiddleware(req, res, next);
  }
}
