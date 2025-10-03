import { Module } from '@nestjs/common';
import { ContpaqExcelService } from './contpaq-excel.service';
import { ContpaqExcelController } from './contpaq-excel.controller';

@Module({
  controllers: [ContpaqExcelController],
  providers: [ContpaqExcelService],
})
export class ContpaqExcelModule {}
