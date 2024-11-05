import { Expose } from 'class-transformer';

export class UploadAvatarRDO {
  @Expose()
  public avatarPath!: string;
}
