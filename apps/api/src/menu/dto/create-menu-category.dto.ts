import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateMenuCategoryDto {
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

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
