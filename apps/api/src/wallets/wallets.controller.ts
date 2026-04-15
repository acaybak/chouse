import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/jwt-payload.type';
import { CreateLoyaltyTransactionDto } from './dto/create-loyalty-transaction.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../common/enums/role-name.enum';

@Controller('wallets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get('my')
  findMyWallets(@CurrentUser() user: JwtPayload) {
    return this.walletsService.findWalletsByUser(user.sub);
  }

  @Get('user/:userId')
  @Roles(RoleName.ADMIN, RoleName.CASHIER)
  findByUser(@Param('userId') userId: string) {
    return this.walletsService.findWalletsByUser(userId);
  }

  @Post('transactions')
  @Roles(RoleName.ADMIN, RoleName.CASHIER)
  addPoints(
    @Body() dto: CreateLoyaltyTransactionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.walletsService.createLoyaltyTransaction(dto, user.sub);
  }
}
