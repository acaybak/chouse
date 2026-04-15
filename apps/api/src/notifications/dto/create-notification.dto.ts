import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsString()
  titleTr: string;

  @IsString()
  titleEn: string;

  @IsString()
  bodyTr: string;

  @IsString()
  bodyEn: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
