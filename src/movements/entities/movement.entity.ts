import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AccountingAccount } from '../../accounting-accounts/entities/accounting-account.entity';
import { Segment } from '../../segments/entities/segment.entity';

@Entity('movements')
export class Movement {
  @PrimaryGeneratedColumn({ name: 'movement_id' })
  movementId: number;

  @Column({ name: 'segment_id' })
  segmentId: number;

  @Column({ name: 'accounting_account_id' })
  accountingAccountId: number;

  // Relaciones TypeORM
  @ManyToOne(() => Segment, { eager: false })
  @JoinColumn({ name: 'segment_id' })
  segment: Segment;

  @ManyToOne(() => AccountingAccount, { eager: false })
  @JoinColumn({ name: 'accounting_account_id' })
  accountingAccount: AccountingAccount;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'varchar', length: 20 })
  type: 'Egresos' | 'Ingresos';

  @Column()
  number: number;

  @Column()
  supplier: string;

  @Column()
  concept: string;

  @Column()
  reference: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  charge: number | null;
}
