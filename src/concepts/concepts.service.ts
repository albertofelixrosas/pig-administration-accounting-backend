import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConceptDto } from './dto/create-concept.dto';
import { UpdateConceptDto } from './dto/update-concept.dto';
import { Concept } from './entities/concept.entity';

@Injectable()
export class ConceptsService {
  constructor(
    @InjectRepository(Concept)
    private conceptRepository: Repository<Concept>,
  ) {}

  async create(createConceptDto: CreateConceptDto): Promise<Concept> {
    const concept = this.conceptRepository.create(createConceptDto);
    return await this.conceptRepository.save(concept);
  }

  async findAll(): Promise<Concept[]> {
    return await this.conceptRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Concept> {
    const concept = await this.conceptRepository.findOne({
      where: { conceptId: id },
    });

    if (!concept) {
      throw new NotFoundException(`Concepto con ID ${id} no encontrado`);
    }

    return concept;
  }

  async update(
    id: number,
    updateConceptDto: UpdateConceptDto,
  ): Promise<Concept> {
    const concept = await this.findOne(id); // Esto ya lanza NotFoundException si no existe

    Object.assign(concept, updateConceptDto);
    return await this.conceptRepository.save(concept);
  }

  async remove(id: number): Promise<void> {
    const concept = await this.findOne(id); // Esto ya lanza NotFoundException si no existe
    await this.conceptRepository.remove(concept);
  }
}
