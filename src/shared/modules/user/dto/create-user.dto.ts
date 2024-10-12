// DTO (Data Transfer Object) — ещё один паттерн проектирования
// Его применяют для описания контрактов передачи данных между слоями приложения или подсистемами приложения.

import { UserType } from '../../../types/user-type.enum.js';

export class CreateUserDto {
    public email!: string;
    public avatarPath!: string;
    public firstName!: string;
    public lastName!: string;
    public password!: string;
    public type!: UserType;
}