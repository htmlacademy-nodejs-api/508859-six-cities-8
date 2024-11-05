import { IsMongoId } from 'class-validator';

export class AddFavoriteDTO {

  @IsMongoId()
  public offerId!: string;
}
