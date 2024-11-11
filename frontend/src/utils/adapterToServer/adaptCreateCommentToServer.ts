import { CreateCommentDTO } from '../../dto/comment/create-comment.dto';
import { NewComment } from '../../types/types';

export const adaptCreateCommentToServer =
  (id: string, comment: NewComment): CreateCommentDTO => ({
    offerId: id, 
    text: comment.comment,
    rating: comment.rating,
  });