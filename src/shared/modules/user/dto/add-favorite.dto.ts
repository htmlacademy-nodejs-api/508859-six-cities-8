import { IsMongoId } from 'class-validator';

export class AddFavoriteDto {

  @IsMongoId()
  public offerId!: string;
}
