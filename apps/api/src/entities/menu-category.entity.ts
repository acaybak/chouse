import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MenuItem } from './menu-item.entity';

@Entity('menu_categories')
export class MenuCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nameTr: string;

  @Column()
  nameEn: string;

  @Column({ nullable: true })
  descriptionTr: string | null;

  @Column({ nullable: true })
  descriptionEn: string | null;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'integer', default: 0 })
  sortOrder: number;

  @OneToMany(() => MenuItem, (item) => item.category)
  items: MenuItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
