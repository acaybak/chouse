import { IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class SendOtpDto {
  @IsPhoneNumber('TR')
  phone: string;

  @IsString()
  @MinLength(1)
  userId: string;
}
