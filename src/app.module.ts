import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccountingAccountsModule } from './accounting-accounts/accounting-accounts.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConceptsModule } from './concepts/concepts.module';
import { ContpaqExcelModule } from './contpaq-excel/contpaq-excel.module';
import { DatabaseModule } from './database/database.module';
import { MovementsModule } from './movements/movements.module';
import { SegmentsModule } from './segments/segments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    DatabaseModule,
    ContpaqExcelModule,
    AccountingAccountsModule,
    SegmentsModule,
    MovementsModule,
    ConceptsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
