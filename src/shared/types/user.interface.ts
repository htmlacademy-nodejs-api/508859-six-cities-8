import { UserType } from './user-type.enum.js';

export interface User {
    userName: string;
    email: string;
    avatarPath?: string;
    password?: string;
    type: UserType;
}
