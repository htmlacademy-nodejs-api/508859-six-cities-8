import { IsEmail, IsString } from 'class-validator';

export class LoginUserDTO {
  @IsEmail()
  public email!: string;

  @IsString()
  public password!: string;
}
