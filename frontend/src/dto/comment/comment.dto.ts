import { UserDTO } from '../user/user.dto';

export class CommentDTO {
  public id!: string;

  public text!: string;

  public publicationDate!: string;

  public rating!: number;

  public user!: UserDTO;
}
