import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('movements')
export class Movement {
  @PrimaryGeneratedColumn({ name: 'movement_id' })
  movementId: number;

  @Column({ name: 'segment_id' })
  segmentId: number;

  @Column({ name: 'accounting_account_id' })
  accountingAccountId: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'enum', enum: ['Egresos', 'Ingresos'] })
  type: 'Egresos' | 'Ingresos';

  @Column()
  number: number;

  @Column()
  supplier: string;

  @Column()
  concept: string;

  @Column()
  reference: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  charge: number | null;
}
