import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class GoogleLoginDto {
  @IsOptional()
  @IsString()
  idToken?: string;

  @IsOptional()
  @IsString()
  googleId?: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  fullName: string;
}
