import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoyaltyTransaction, User, Wallet } from '../entities';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, LoyaltyTransaction, User]),
    UsersModule,
  ],
  providers: [WalletsService],
  controllers: [WalletsController],
})
export class WalletsModule {}
