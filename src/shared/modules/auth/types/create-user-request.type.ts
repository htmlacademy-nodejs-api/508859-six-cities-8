import { Request } from 'express';
import { RequestBody, RequestParams } from '../../../libs/rest/index.js';
import { CreateUserDTO } from '../../user/dto/create-user.dto.js';

export type CreateUserRequest = Request<RequestParams, RequestBody, CreateUserDTO>;
