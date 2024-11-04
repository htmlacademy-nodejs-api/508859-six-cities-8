import { inject, injectable } from 'inversify';
import * as crypto from 'node:crypto';
import { SignJWT } from 'jose';

import { AuthService } from './auth-service.interface.js';
import { Logger } from '../../libs/logger/index.js';
import { LoginUserDto, UserService } from '../user/index.js';
import { TokenPayload } from './types/tokenPayload.js';
import { Config, IRestSchema } from '../../libs/config/index.js';
import { UserNotFoundException, UserPasswordIncorrectException } from './errors/index.js';
import { JWT_ALGORITHM, JWT_EXPIRED } from './auth.constant.js';
import { COMPONENT } from '../../constants/component.constant.js';
import { UserEntity } from '../../entities/index.js';

@injectable()
export class DefaultAuthService implements AuthService {
  constructor(
    @inject(COMPONENT.LOGGER) private readonly logger: Logger,
    @inject(COMPONENT.USER_SERVICE) private readonly userService: UserService,
    @inject(COMPONENT.CONFIG) private readonly config: Config<IRestSchema>,
  ) {}

  public async authenticate(user: UserEntity): Promise<string> {
    const jwtSecret = this.config.get('JWT_SECRET');
    const secretKey = crypto.createSecretKey(jwtSecret, 'utf-8');
    const tokenPayload: TokenPayload = {
      email: user.email,
      userName: user.userName,
      id: user.id,
    };

    this.logger.info(`Create token for ${user.email}`);
    return new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRED)
      .sign(secretKey);
  }

  public async verify(dto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userService.findByEmail(dto.email);
    if (! user) {
      this.logger.warn(`User with ${dto.email} not found`);
      throw new UserNotFoundException();
    }

    if (! user.verifyPassword(dto.password, this.config.get('SALT'))) {
      this.logger.warn(`Incorrect password for ${dto.email}`);
      throw new UserPasswordIncorrectException();
    }

    return user;
  }


}
