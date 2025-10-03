import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'ID único del movimiento',
    example: 1,
  })
  @PrimaryGeneratedColumn({ name: 'movement_id' })
  movementId: number;

  @ApiProperty({
    description: 'ID del segmento asociado',
    example: 1,
  })
  @Column({ name: 'segment_id' })
  segmentId: number;

  @ApiProperty({
    description: 'ID de la cuenta contable asociada',
    example: 1,
  })
  @Column({ name: 'accounting_account_id' })
  accountingAccountId: number;

  // Relaciones TypeORM
  @ApiProperty({
    description: 'Segmento asociado al movimiento',
    type: () => Segment,
  })
  @ManyToOne(() => Segment, { eager: false })
  @JoinColumn({ name: 'segment_id' })
  segment: Segment;

  @ApiProperty({
    description: 'Cuenta contable asociada al movimiento',
    type: () => AccountingAccount,
  })
  @ManyToOne(() => AccountingAccount, { eager: false })
  @JoinColumn({ name: 'accounting_account_id' })
  accountingAccount: AccountingAccount;

  @ApiProperty({
    description: 'Fecha del movimiento',
    example: '2025-10-02',
  })
  @Column({ type: 'date' })
  date: Date;

  @ApiProperty({
    description: 'Tipo de movimiento',
    enum: ['Egresos', 'Ingresos'],
    example: 'Egresos',
  })
  @Column({ type: 'varchar', length: 20 })
  type: 'Egresos' | 'Ingresos';

  @ApiProperty({
    description: 'Número del movimiento',
    example: 1001,
  })
  @Column()
  number: number;

  @ApiProperty({
    description: 'Proveedor o cliente',
    example: 'Proveedor ABC S.A. de C.V.',
  })
  @Column()
  supplier: string;

  @ApiProperty({
    description: 'Concepto del movimiento',
    example: 'Compra de materiales para oficina',
  })
  @Column()
  concept: string;

  @ApiProperty({
    description: 'Referencia del movimiento',
    example: 'FAC-001-2025',
  })
  @Column()
  reference: string;

  @ApiProperty({
    description: 'Monto del cargo',
    example: 1500.5,
    nullable: true,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  charge: number | null;
}
