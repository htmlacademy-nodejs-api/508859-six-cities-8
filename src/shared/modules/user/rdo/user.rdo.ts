import { Expose } from 'class-transformer';
import { UserType } from '../../../types/index.js';

export class UserRdo {
  @Expose()
  public email!: string;

  @Expose()
  public avatarPath!: string;

  @Expose()
  public userName!: string;

  @Expose()
  public type!: UserType;
}

// TODO: Работа с favorites
// UserController GET /users/favorites
// OfferService (user)
// OfferService.aggregate(user.favorites)
// UserService
// UserController
// OfferRDO[]

// Получение офферов GET /offers => OfferRDO[]
// Первый вариант
// 1) OfferController
// 2) OfferService
// 3) UserService => User
// 4) OfferService.findMany.aggregate(User)
// Второй вариант
// GET users/favorites => OfferRDO[]
// 1) UserController
// 2) UserService
// 3) OfferService.findMany.aggregate(User)
