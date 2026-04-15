import { IsPhoneNumber, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsPhoneNumber('TR')
  phone: string;

  @IsString()
  userId: string;

  @IsString()
  @Length(4, 6)
  otpCode: string;
}
