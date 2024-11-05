import { UserEntity } from '../../entities/index.js';
import { LoginUserDTO } from './dto/login-user.dto.js';

export interface AuthService {
  authenticate(user: UserEntity): Promise<string>;
  verify(dto: LoginUserDTO): Promise<UserEntity>;
}
