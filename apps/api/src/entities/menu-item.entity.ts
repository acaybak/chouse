import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MenuCategory } from './menu-category.entity';

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => MenuCategory, (category) => category.items, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'categoryId' })
  category: MenuCategory;

  @Column()
  categoryId: string;

  @Column()
  nameTr: string;

  @Column()
  nameEn: string;

  @Column({ nullable: true })
  descriptionTr: string | null;

  @Column({ nullable: true })
  descriptionEn: string | null;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  priceTl: string;

  @Column({ type: 'integer', nullable: true })
  pointsCost: number | null;

  @Column({ default: false })
  isFreebieEligible: boolean;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
