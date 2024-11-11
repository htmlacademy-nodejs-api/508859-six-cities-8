import { CreateUserDTO } from '../../dto/user/create-user.dto';
import { UserRegister } from '../../types/types';

export const adaptSignUpToServer =
  (user: UserRegister): CreateUserDTO => ({
    userName: user.name,
    email: user.email,
    type: user.type,
    password: user.password,
});
