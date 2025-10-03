import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const nodeEnv = this.configService.get<string>('NODE_ENV', 'development');

    return {
      type: 'sqlite',
      database: this.configService.get<string>(
        'DB_DATABASE',
        nodeEnv === 'production' ? 'database.sqlite' : 'database_dev.sqlite',
      ),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: this.configService.get<boolean>(
        'SYNC_DB',
        nodeEnv === 'development',
      ),
      logging: nodeEnv === 'development',
      // SQLite specific options
      autoLoadEntities: true,
      retryAttempts: 5,
      retryDelay: 3000,
    };
  }
}
