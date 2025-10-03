import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSegmentDto } from './dto/create-segment.dto';
import { UpdateSegmentDto } from './dto/update-segment.dto';
import { Segment } from './entities/segment.entity';

@Injectable()
export class SegmentsService {
  constructor(
    @InjectRepository(Segment)
    private readonly segmentRepository: Repository<Segment>,
  ) {}

  /**
   * Crear un nuevo segmento
   */
  async create(createSegmentDto: CreateSegmentDto): Promise<Segment> {
    try {
      // Verificar que el código no exista
      const existingSegment = await this.segmentRepository.findOne({
        where: { code: createSegmentDto.code },
      });

      if (existingSegment) {
        throw new ConflictException(
          `Ya existe un segmento con código "${createSegmentDto.code}"`,
        );
      }

      const segment = this.segmentRepository.create(createSegmentDto);
      const savedSegment = await this.segmentRepository.save(segment);

      console.log('Segmento creado:', savedSegment);
      return savedSegment;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      console.error('Error creando segmento:', error);
      throw new BadRequestException(
        `Error creando segmento: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      );
    }
  }

  /**
   * Obtener todos los segmentos
   */
  async findAll(): Promise<Segment[]> {
    try {
      const segments = await this.segmentRepository.find({
        order: { segmentId: 'ASC' },
      });

      console.log(`Encontrados ${segments.length} segmentos`);
      return segments;
    } catch (error) {
      console.error('Error obteniendo segmentos:', error);
      throw new BadRequestException(
        `Error obteniendo segmentos: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      );
    }
  }

  /**
   * Obtener un segmento por ID
   */
  async findOne(id: number): Promise<Segment> {
    try {
      const segment = await this.segmentRepository.findOne({
        where: { segmentId: id },
        relations: ['movements'],
      });

      if (!segment) {
        throw new NotFoundException(`Segmento con ID ${id} no encontrado`);
      }

      console.log('Segmento encontrado:', segment);
      return segment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('Error obteniendo segmento:', error);
      throw new BadRequestException(
        `Error obteniendo segmento: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      );
    }
  }

  /**
   * Actualizar un segmento
   */
  async update(
    id: number,
    updateSegmentDto: UpdateSegmentDto,
  ): Promise<Segment> {
    try {
      // Verificar que el segmento existe
      const existingSegment = await this.findOne(id);

      // Si se actualiza el código, verificar que no exista otro con el mismo código
      if (
        updateSegmentDto.code &&
        updateSegmentDto.code !== existingSegment.code
      ) {
        const duplicateSegment = await this.segmentRepository.findOne({
          where: { code: updateSegmentDto.code },
        });

        if (duplicateSegment) {
          throw new ConflictException(
            `Ya existe un segmento con código "${updateSegmentDto.code}"`,
          );
        }
      }

      // Actualizar el segmento
      await this.segmentRepository.update(id, updateSegmentDto);

      // Retornar el segmento actualizado
      const updatedSegment = await this.findOne(id);

      console.log('Segmento actualizado:', updatedSegment);
      return updatedSegment;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      console.error('Error actualizando segmento:', error);
      throw new BadRequestException(
        `Error actualizando segmento: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      );
    }
  }

  /**
   * Eliminar un segmento
   */
  async remove(
    id: number,
  ): Promise<{ message: string; deletedSegment: Segment }> {
    try {
      // Verificar que el segmento existe
      const existingSegment = await this.findOne(id);

      // Verificar que no tenga movimientos asociados
      if (existingSegment.movements && existingSegment.movements.length > 0) {
        throw new ConflictException(
          `No se puede eliminar el segmento porque tiene ${existingSegment.movements.length} movimiento(s) asociado(s)`,
        );
      }

      // Eliminar el segmento
      await this.segmentRepository.delete(id);

      console.log(`Segmento con ID ${id} eliminado`);
      return {
        message: `Segmento con ID ${id} eliminado exitosamente`,
        deletedSegment: existingSegment,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      console.error('Error eliminando segmento:', error);
      throw new BadRequestException(
        `Error eliminando segmento: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      );
    }
  }

  /**
   * Buscar segmento por código
   */
  async findByCode(code: string): Promise<Segment | null> {
    try {
      const segment = await this.segmentRepository.findOne({
        where: { code },
      });

      console.log(
        `Segmento con código "${code}":`,
        segment ? 'encontrado' : 'no encontrado',
      );
      return segment;
    } catch (error) {
      console.error('Error buscando segmento por código:', error);
      throw new BadRequestException(
        `Error buscando segmento por código: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      );
    }
  }

  /**
   * Buscar o crear segmento por código (útil para la integración con ContPAQ)
   */
  async findOrCreateByCode(code: string, name?: string): Promise<Segment> {
    try {
      let segment = await this.findByCode(code);

      if (!segment) {
        const createDto: CreateSegmentDto = {
          code,
          name: name || `Segmento ${code}`,
        };

        segment = await this.create(createDto);
        console.log(`Segmento creado automáticamente: ${code}`);
      }

      return segment;
    } catch (error) {
      console.error('Error en findOrCreateByCode:', error);
      throw new BadRequestException(
        `Error buscando o creando segmento: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      );
    }
  }
}
