import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, User } from '../entities';
import { CreateCashierDto } from './dto/create-cashier.dto';
import { RoleName } from '../common/enums/role-name.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  listUsers() {
    return this.usersRepository.find({ order: { createdAt: 'DESC' } });
  }

  async listCashiers() {
    const cashierRole = await this.ensureRole(RoleName.CASHIER);
    return this.usersRepository.find({ where: { roleId: cashierRole.id } });
  }

  async createCashier(dto: CreateCashierDto) {
    const cashierRole = await this.ensureRole(RoleName.CASHIER);
    const cashier = this.usersRepository.create({
      email: dto.email.toLowerCase(),
      fullName: dto.fullName,
      phone: dto.phone ?? null,
      phoneVerified: !!dto.phone,
      googleId: null,
      roleId: cashierRole.id,
    });

    return this.usersRepository.save(cashier);
  }

  async findByPhone(phone: string) {
    const user = await this.usersRepository.findOne({ where: { phone } });
    if (!user) {
      throw new NotFoundException('User with phone not found.');
    }

    return user;
  }

  private async ensureRole(roleName: RoleName) {
    const existingRole = await this.rolesRepository.findOne({
      where: { name: roleName },
    });
    if (existingRole) {
      return existingRole;
    }

    return this.rolesRepository.save(
      this.rolesRepository.create({ name: roleName }),
    );
  }
}
