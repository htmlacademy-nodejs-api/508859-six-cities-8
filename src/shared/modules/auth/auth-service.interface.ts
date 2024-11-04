import { UserEntity } from '../../entities/index.js';
import { LoginUserDto } from '../user/index.js';

export interface AuthService {
  authenticate(user: UserEntity): Promise<string>;
  verify(dto: LoginUserDto): Promise<UserEntity>;
}
