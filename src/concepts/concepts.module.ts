import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConceptsController } from './concepts.controller';
import { ConceptsService } from './concepts.service';
import { Concept } from './entities/concept.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Concept])],
  controllers: [ConceptsController],
  providers: [ConceptsService],
  exports: [ConceptsService], // Exportamos el servicio por si otros módulos lo necesitan
})
export class ConceptsModule {}
