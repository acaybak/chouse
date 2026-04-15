import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuCategory, MenuItem } from '../entities';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

@Module({
  imports: [TypeOrmModule.forFeature([MenuCategory, MenuItem])],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
