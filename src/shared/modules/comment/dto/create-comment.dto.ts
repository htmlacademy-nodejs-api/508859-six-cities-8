import { IsInt, IsMongoId, IsString, Length, Max, Min } from 'class-validator';

import { CREATE_COMMENT_MESSAGES } from './create-comment.messages.js';

export class CreateCommentDto {
  @IsString({ message: CREATE_COMMENT_MESSAGES.TEXT.invalidFormat })
  @Length(5, 1024, { message: 'min is 5, max is 1024 '})
  public text!: string;

  @IsInt({ message: CREATE_COMMENT_MESSAGES.RATING.invalidFormat })
  @Min(1, { message: CREATE_COMMENT_MESSAGES.RATING.minValue })
  @Max(5, { message: CREATE_COMMENT_MESSAGES.RATING.maxValue })
  public rating!: number;

  @IsMongoId({ message: CREATE_COMMENT_MESSAGES.OFFER_ID.invalidFormat })
  public offerId!: string;

  @IsMongoId({ message: CREATE_COMMENT_MESSAGES.USER_ID.invalidFormat })
  public userId!: string;
}
