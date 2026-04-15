import {
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateLoyaltyTransactionDto {
  @IsString()
  phone: string;

  @IsString()
  walletContext: string;

  @IsString()
  transactionType: string;

  @IsString()
  source: string;

  @IsInt()
  @Min(1)
  amountPoints: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amountTl: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
