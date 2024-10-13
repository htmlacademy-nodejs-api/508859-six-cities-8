// TODO: Удалить в будущем, работа через mongoose
import { Schema, Document, model } from 'mongoose';
import { User, UserType } from '../../types/index.js';

export interface UserDocument extends User, Document {
    createdAt: Date,
    updatedAt: Date,
}

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is incorrect'],
    required: true,
  },
  avatarPath: {
    type: String,
    required: true,
    minlength: [5, 'Min length for avatar path is 5'],
  },
  firstName: {
    type: String,
    required: true,
    minlength: [2, 'Min length for firstname is 2']
  },
  lastName: String,
  type: {
    enum: UserType,
    required: true,
  }
}, { timestamps: true });

export const UserModel = model<UserDocument>('User', userSchema);
