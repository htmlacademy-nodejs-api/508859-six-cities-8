import { CommentDTO } from '../../dto/comment/comment.dto';
import { Comment } from '../../types/types';
import { adaptUserToClient } from './adaptUserToClient';

export const adaptCommentsToClient =
  (comments: CommentDTO[]): Comment[] =>
    comments
      .filter((comment: CommentDTO) =>
        comment.user !== null,
      )
      .map((comment: CommentDTO) => ({
        id: comment.id,
        comment: comment.text,
        date: comment.publicationDate,
        rating: comment.rating,
        user: adaptUserToClient(comment.user),
      }));

export const adaptCommentToClient = (comment: CommentDTO): Comment => ({
    id: comment.id,
    comment: comment.text,
    date: comment.publicationDate,
    rating: comment.rating,
    user: adaptUserToClient(comment.user),
}) 