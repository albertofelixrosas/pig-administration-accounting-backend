import { Module } from '@nestjs/common';
import { MovementsModule } from '../movements/movements.module';
import { ContpaqExcelController } from './contpaq-excel.controller';
import { ContpaqExcelService } from './contpaq-excel.service';

@Module({
  imports: [MovementsModule],
  controllers: [ContpaqExcelController],
  providers: [ContpaqExcelService],
})
export class ContpaqExcelModule {}
