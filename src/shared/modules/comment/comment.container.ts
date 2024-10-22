import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { CommentService } from './comment-service.interface.js';
import { CommentEntity, CommentModel } from './comment.entity.js';
import { DefaultCommentService } from './default-comment.service.js';
import { COMPONENT } from '../../constants/index.js';

export function createCommentContainer() {
  const commentContainer = new Container();

  commentContainer.bind<CommentService>(COMPONENT.COMMENT_SERVICE)
    .to(DefaultCommentService)
    .inSingletonScope();

  commentContainer.bind<types.ModelType<CommentEntity>>(COMPONENT.COMMENT_MODEL)
    .toConstantValue(CommentModel);

  return commentContainer;
}
