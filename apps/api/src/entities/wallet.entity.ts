import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { LoyaltyTransaction } from './loyalty-transaction.entity';

@Entity('wallets')
@Unique(['userId', 'context'])
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.wallets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column()
  context: string;

  @Column({ type: 'integer', default: 0 })
  balancePoints: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  balanceTl: string;

  @OneToMany(() => LoyaltyTransaction, (transaction) => transaction.wallet)
  transactions: LoyaltyTransaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
