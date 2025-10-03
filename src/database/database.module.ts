import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Concept } from '../concepts/entities/concept.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [Concept], // Solo Concept por ahora para demostración
      synchronize: true, // Solo para desarrollo
      logging: true, // Activar logging para ver las consultas
    }),
  ],
})
export class DatabaseModule {}
