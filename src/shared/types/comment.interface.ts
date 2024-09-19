import { User } from './user.interface.js';

export interface Comment {
    text: string;
    publicationDate: Date;
    rating: number;
    author: User;
}