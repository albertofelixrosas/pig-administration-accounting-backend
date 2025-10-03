import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountingAccountsController } from './accounting-accounts.controller';
import { AccountingAccountsService } from './accounting-accounts.service';
import { AccountingAccount } from './entities/accounting-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccountingAccount])],
  controllers: [AccountingAccountsController],
  providers: [AccountingAccountsService],
  exports: [AccountingAccountsService],
})
export class AccountingAccountsModule {}
