import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMovementDto } from './dto/create-movement.dto';
import { UpdateMovementDto } from './dto/update-movement.dto';
import { Movement } from './entities/movement.entity';

@Injectable()
export class MovementsService {
  constructor(
    @InjectRepository(Movement)
    private readonly movementRepository: Repository<Movement>,
  ) {}

  /**
   * Crear un nuevo movimiento
   */
  async create(createMovementDto: CreateMovementDto): Promise<Movement> {
    try {
      // Convertir la fecha string a Date
      const movementData = {
        ...createMovementDto,
        date: new Date(createMovementDto.date),
      };

      const movement = this.movementRepository.create(movementData);
      const savedMovement = await this.movementRepository.save(movement);

      console.log('Movimiento creado:', savedMovement);
      return savedMovement;
    } catch (error) {
      console.error('Error creando movimiento:', error);
      throw new BadRequestException(
        `Error creando movimiento: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      );
    }
  }

  /**
   * Obtener todos los movimientos
   */
  async findAll(): Promise<Movement[]> {
    try {
      const movements = await this.movementRepository.find({
        relations: ['segment', 'accountingAccount'],
        order: { date: 'DESC', movementId: 'DESC' },
      });

      console.log(`Encontrados ${movements.length} movimientos`);
      return movements;
    } catch (error) {
      console.error('Error obteniendo movimientos:', error);
      throw new BadRequestException(
        `Error obteniendo movimientos: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      );
    }
  }

  /**
   * Obtener un movimiento por ID
   */
  async findOne(id: number): Promise<Movement> {
    try {
      const movement = await this.movementRepository.findOne({
        where: { movementId: id },
        relations: ['segment', 'accountingAccount'],
      });

      if (!movement) {
        throw new NotFoundException(`Movimiento con ID ${id} no encontrado`);
      }

      console.log('Movimiento encontrado:', movement);
      return movement;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('Error obteniendo movimiento:', error);
      throw new BadRequestException(
        `Error obteniendo movimiento: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      );
    }
  }

  /**
   * Actualizar un movimiento
   */
  async update(
    id: number,
    updateMovementDto: UpdateMovementDto,
  ): Promise<Movement> {
    try {
      // Verificar que el movimiento existe
      const existingMovement = await this.findOne(id);

      // Preparar los datos de actualización
      const updateData: any = { ...updateMovementDto };

      // Convertir fecha si se proporciona
      if (updateMovementDto.date) {
        updateData.date = new Date(updateMovementDto.date);
      }

      // Actualizar el movimiento
      await this.movementRepository.update(id, updateData);

      // Retornar el movimiento actualizado
      const updatedMovement = await this.findOne(id);

      console.log('Movimiento actualizado:', updatedMovement);
      return updatedMovement;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('Error actualizando movimiento:', error);
      throw new BadRequestException(
        `Error actualizando movimiento: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      );
    }
  }

  /**
   * Eliminar un movimiento
   */
  async remove(
    id: number,
  ): Promise<{ message: string; deletedMovement: Movement }> {
    try {
      // Verificar que el movimiento existe
      const existingMovement = await this.findOne(id);

      // Eliminar el movimiento
      await this.movementRepository.delete(id);

      console.log(`Movimiento con ID ${id} eliminado`);
      return {
        message: `Movimiento con ID ${id} eliminado exitosamente`,
        deletedMovement: existingMovement,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('Error eliminando movimiento:', error);
      throw new BadRequestException(
        `Error eliminando movimiento: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      );
    }
  }

  /**
   * Buscar movimientos por segmento
   */
  async findBySegment(segmentId: number): Promise<Movement[]> {
    try {
      const movements = await this.movementRepository.find({
        where: { segmentId },
        relations: ['segment', 'accountingAccount'],
        order: { date: 'DESC' },
      });

      console.log(
        `Encontrados ${movements.length} movimientos para segmento ${segmentId}`,
      );
      return movements;
    } catch (error) {
      console.error('Error obteniendo movimientos por segmento:', error);
      throw new BadRequestException(
        `Error obteniendo movimientos por segmento: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      );
    }
  }

  /**
   * Buscar movimientos por cuenta contable
   */
  async findByAccountingAccount(
    accountingAccountId: number,
  ): Promise<Movement[]> {
    try {
      const movements = await this.movementRepository.find({
        where: { accountingAccountId },
        relations: ['segment', 'accountingAccount'],
        order: { date: 'DESC' },
      });

      console.log(
        `Encontrados ${movements.length} movimientos para cuenta contable ${accountingAccountId}`,
      );
      return movements;
    } catch (error) {
      console.error('Error obteniendo movimientos por cuenta contable:', error);
      throw new BadRequestException(
        `Error obteniendo movimientos por cuenta contable: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      );
    }
  }
}
