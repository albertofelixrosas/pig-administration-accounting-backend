import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule } from '@nestjs/config';
// import { DatabaseConfigService } from '../config/database.config';

@Module({
  // Comentado temporalmente para demostración de Swagger
  // imports: [
  //   TypeOrmModule.forRootAsync({
  //     imports: [ConfigModule],
  //     useClass: DatabaseConfigService,
  //   }),
  // ],
})
export class DatabaseModule {}