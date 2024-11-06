import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import {
  BaseController,
  HttpError,
  HttpMethod,
  PrivateRouteMiddleware,
  ValidateDtoMiddleware,
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { COMPONENT } from '../../constants/index.js';
import { Config, IRestSchema } from '../../libs/config/index.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../helpers/index.js';
import { AuthService, LoginUserDTO } from '../auth/index.js';
import { LoggedUserRDO } from './rdo/logged-user.rdo.js';
import { CreateUserDTO, UserRDO, UserService } from '../user/index.js';
import { CreateUserRequest } from './types/create-user-request.type.js';
import { LoginUserRequest } from './types/login-user-request.type.js';

@injectable()
export class AuthController extends BaseController {
  constructor(
    @inject(COMPONENT.LOGGER) protected readonly logger: Logger,
    @inject(COMPONENT.USER_SERVICE) private readonly userService: UserService,
    @inject(COMPONENT.CONFIG) private readonly configService: Config<IRestSchema>,
    @inject(COMPONENT.AUTH_SERVICE) private readonly authService: AuthService,
  ) {
    super(logger);
    this.logger.info('Register routes for AuthController');

    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.register, middlewares: [new ValidateDtoMiddleware(CreateUserDTO)] });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.login, middlewares: [new ValidateDtoMiddleware(LoginUserDTO)] });
    this.addRoute({ path: '/login', method: HttpMethod.Get, handler: this.checkAuthenticate, middlewares: [new PrivateRouteMiddleware()] });
  }

  public async register(
    { body }: CreateUserRequest,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'AuthController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserRDO, result));
  }

  public async login(
    { body }: LoginUserRequest,
    res: Response,
  ): Promise<void> {
    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);
    const responseData = fillDTO(LoggedUserRDO, {
      email: user.email,
      token,
    });
    this.ok(res, responseData);
  }

  public async checkAuthenticate({ tokenPayload }: Request, res: Response) {
    const userId = tokenPayload?.sub;
    const foundedUser = await this.userService.findById(userId);

    if (!foundedUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'AuthController'
      );
    }

    this.ok(res, fillDTO(UserRDO, foundedUser));
  }
}
