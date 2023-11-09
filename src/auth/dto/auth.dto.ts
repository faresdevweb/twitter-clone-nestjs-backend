import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class AuthDTO {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsString()
  @IsOptional()
  username: string;
}
