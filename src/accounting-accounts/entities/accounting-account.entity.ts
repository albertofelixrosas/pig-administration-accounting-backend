import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Movement } from '../../movements/entities/movement.entity';

@Entity('accounting_accounts')
export class AccountingAccount {
  @PrimaryGeneratedColumn({ name: 'accounting_account_id' })
  accountingAccountId: number;

  @Column({ name: 'account_code' })
  acountCode: string;

  @Column()
  name: string;

  // Relación inversa con Movement
  @OneToMany(() => Movement, (movement) => movement.accountingAccount)
  movements: Movement[];
}
