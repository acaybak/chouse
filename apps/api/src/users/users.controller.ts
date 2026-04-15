import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../common/enums/role-name.enum';
import { CreateCashierDto } from './dto/create-cashier.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(RoleName.ADMIN)
  listUsers() {
    return this.usersService.listUsers();
  }

  @Get('cashiers')
  @Roles(RoleName.ADMIN)
  listCashiers() {
    return this.usersService.listCashiers();
  }

  @Post('cashiers')
  @Roles(RoleName.ADMIN)
  createCashier(@Body() dto: CreateCashierDto) {
    return this.usersService.createCashier(dto);
  }

  @Get('by-phone/:phone')
  @Roles(RoleName.ADMIN, RoleName.CASHIER)
  findByPhone(@Param('phone') phone: string) {
    return this.usersService.findByPhone(phone);
  }
}
