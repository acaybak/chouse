import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoyaltyTransaction, User, Wallet } from '../entities';
import { CreateLoyaltyTransactionDto } from './dto/create-loyalty-transaction.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletsRepository: Repository<Wallet>,
    @InjectRepository(LoyaltyTransaction)
    private readonly transactionsRepository: Repository<LoyaltyTransaction>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly usersService: UsersService,
  ) {}

  findWalletsByUser(userId: string) {
    return this.walletsRepository.find({
      where: { userId },
      order: { createdAt: 'ASC' },
    });
  }

  async createLoyaltyTransaction(
    dto: CreateLoyaltyTransactionDto,
    createdByUserId: string,
  ) {
    const user = await this.usersService.findByPhone(dto.phone);
    let wallet = await this.walletsRepository.findOne({
      where: { userId: user.id, context: dto.walletContext },
    });

    if (!wallet) {
      wallet = this.walletsRepository.create({
        userId: user.id,
        context: dto.walletContext,
        balancePoints: 0,
        balanceTl: '0.00',
      });
    }

    wallet.balancePoints += dto.amountPoints;
    wallet.balanceTl = (Number(wallet.balanceTl) + dto.amountTl).toFixed(2);
    const savedWallet = await this.walletsRepository.save(wallet);

    const transaction = this.transactionsRepository.create({
      walletId: savedWallet.id,
      createdByUserId,
      transactionType: dto.transactionType,
      source: dto.source,
      amountPoints: dto.amountPoints,
      amountTl: dto.amountTl.toFixed(2),
      metadata: dto.metadata ?? null,
    });

    const savedTransaction =
      await this.transactionsRepository.save(transaction);

    return {
      wallet: savedWallet,
      transaction: savedTransaction,
    };
  }
}
