import { Request } from 'express';
import { RequestBody, RequestParams } from '../../../libs/rest/index.js';
import { AddFavoriteDto } from '../dto/add-favorite.dto.js';

export type AddFavoriteRequest = Request<RequestParams, RequestBody, AddFavoriteDto>;
