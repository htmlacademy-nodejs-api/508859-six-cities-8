import { CityName, Type, Location } from '../../types/types';
import { UserDTO } from '../user/user.dto';

export class FullOfferDTO {
  public id!: string;

  public title!: string;

  public description!: string;

  public publicationDate!: string;

  public city!: CityName;

  public previewImg!: string;

  public images!: string[];

  public isPremium!: boolean;

  public rating!: number;

  public type!: Type;

  public flatCount!: number;

  public guestCount!: number;

  public cost!: number;

  public conveniences!: string[];

  public isFavorite!: boolean;

  public user!: UserDTO;

  public commentCount!: number;

  public coordinate!: Location;
}
