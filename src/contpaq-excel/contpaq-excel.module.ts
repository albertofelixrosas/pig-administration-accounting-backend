import { Module } from '@nestjs/common';
import { AccountingAccountsModule } from '../accounting-accounts/accounting-accounts.module';
import { MovementsModule } from '../movements/movements.module';
import { SegmentsModule } from '../segments/segments.module';
import { ContpaqExcelController } from './contpaq-excel.controller';
import { ContpaqExcelService } from './contpaq-excel.service';

@Module({
  imports: [MovementsModule, AccountingAccountsModule, SegmentsModule],
  controllers: [ContpaqExcelController],
  providers: [ContpaqExcelService],
})
export class ContpaqExcelModule {}
