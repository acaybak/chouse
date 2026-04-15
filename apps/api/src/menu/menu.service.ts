import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuCategory, MenuItem } from '../entities';
import { CreateMenuCategoryDto } from './dto/create-menu-category.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuCategory)
    private readonly categoriesRepository: Repository<MenuCategory>,
    @InjectRepository(MenuItem)
    private readonly itemsRepository: Repository<MenuItem>,
  ) {}

  getPublicMenu() {
    return this.categoriesRepository.find({
      where: { isActive: true },
      relations: ['items'],
      order: { sortOrder: 'ASC', items: { createdAt: 'ASC' } },
    });
  }

  listCategories() {
    return this.categoriesRepository.find({ order: { sortOrder: 'ASC' } });
  }

  createCategory(dto: CreateMenuCategoryDto) {
    return this.categoriesRepository.save(
      this.categoriesRepository.create({
        ...dto,
        descriptionTr: dto.descriptionTr ?? null,
        descriptionEn: dto.descriptionEn ?? null,
      }),
    );
  }

  async updateCategory(id: string, dto: Partial<CreateMenuCategoryDto>) {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Menu category not found.');
    }

    Object.assign(category, dto);
    return this.categoriesRepository.save(category);
  }

  async deleteCategory(id: string) {
    await this.categoriesRepository.delete({ id });
    return { success: true };
  }

  listItems() {
    return this.itemsRepository.find({ order: { createdAt: 'DESC' } });
  }

  async createItem(dto: CreateMenuItemDto) {
    const category = await this.categoriesRepository.findOne({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new NotFoundException('Menu category not found for item.');
    }

    return this.itemsRepository.save(
      this.itemsRepository.create({
        ...dto,
        priceTl: dto.priceTl.toFixed(2),
        pointsCost: dto.pointsCost ?? null,
        isFreebieEligible: dto.isFreebieEligible ?? false,
        isActive: dto.isActive ?? true,
        descriptionTr: dto.descriptionTr ?? null,
        descriptionEn: dto.descriptionEn ?? null,
      }),
    );
  }

  async updateItem(id: string, dto: Partial<CreateMenuItemDto>) {
    const item = await this.itemsRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('Menu item not found.');
    }

    const updateDto = { ...dto };
    if (typeof updateDto.priceTl === 'number') {
      item.priceTl = updateDto.priceTl.toFixed(2);
      delete updateDto.priceTl;
    }

    Object.assign(item, updateDto);
    return this.itemsRepository.save(item);
  }

  async deleteItem(id: string) {
    await this.itemsRepository.delete({ id });
    return { success: true };
  }
}
