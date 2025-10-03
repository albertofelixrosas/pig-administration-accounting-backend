import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Movement } from '../../movements/entities/movement.entity';

@Entity('accounting_accounts')
export class AccountingAccount {
  @ApiProperty({
    description: 'ID único de la cuenta contable',
    example: 1,
  })
  @PrimaryGeneratedColumn({ name: 'accounting_account_id' })
  accountingAccountId: number;

  @ApiProperty({
    description: 'Código único de la cuenta contable',
    example: '101-001-001-001-01',
  })
  @Column({ name: 'account_code', unique: true })
  accountCode: string;

  @ApiProperty({
    description: 'Nombre descriptivo de la cuenta contable',
    example: 'Caja General',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Movimientos asociados a la cuenta contable',
    type: () => [Movement],
  })
  // Relación inversa con Movement
  @OneToMany(() => Movement, (movement) => movement.accountingAccount)
  movements: Movement[];
}
