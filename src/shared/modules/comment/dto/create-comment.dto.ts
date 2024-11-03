import { IsInt, IsMongoId, IsString, Length, Max, Min } from 'class-validator';
import { COMMENT_DTO_CONSTRAINTS } from '../comment.constant.js';

export class CreateCommentDto {
  @IsString()
  @Length(COMMENT_DTO_CONSTRAINTS.TEXT.MIN_LENGTH, COMMENT_DTO_CONSTRAINTS.TEXT.MAX_LENGTH)
  public text!: string;

  @IsInt()
  @Min(COMMENT_DTO_CONSTRAINTS.RATING.MIN_VALUE)
  @Max(COMMENT_DTO_CONSTRAINTS.RATING.MAX_VALUE)
  public rating!: number;

  @IsMongoId()
  public offerId!: string;

  @IsMongoId()
  public userId!: string;
}
