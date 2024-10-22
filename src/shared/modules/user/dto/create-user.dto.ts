// DTO (Data Transfer Object) — ещё один паттерн проектирования
// Его применяют для описания контрактов передачи данных между слоями приложения или подсистемами приложения.

import { UserType } from '../../../types/user-type.enum.js';

export class CreateUserDto {
  public email!: string;
  // TODO: Указываем дефолтное значение и поле необязательно
  public avatarPath!: string;
  public userName!: string;
  // public firstName!: string;
  // public lastName!: string;
  public password!: string;
  public type!: UserType;
}
