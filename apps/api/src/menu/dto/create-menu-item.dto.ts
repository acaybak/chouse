import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateMenuItemDto {
  @IsString()
  categoryId: string;

  @IsString()
  nameTr: string;

  @IsString()
  nameEn: string;

  @IsOptional()
  @IsString()
  descriptionTr?: string;

  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  priceTl: number;

  @IsOptional()
  @IsInt()
  pointsCost?: number;

  @IsOptional()
  @IsBoolean()
  isFreebieEligible?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
