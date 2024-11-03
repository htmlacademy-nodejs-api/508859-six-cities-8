import { IsLatitude, IsLongitude } from 'class-validator';

export class CoordinateDTO {
 @IsLatitude()
  public latitude!: number;

  @IsLongitude()
 public longitude!: number;
}
