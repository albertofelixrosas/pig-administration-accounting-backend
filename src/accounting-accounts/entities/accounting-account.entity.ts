import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('accounting_accounts')
export class AccountingAccount {
  @PrimaryGeneratedColumn({ name: 'accounting_account_id' })
  accountingAccountId: number;

  @Column({ name: 'account_code' })
  acountCode: string;

  @Column()
  name: string;
}
