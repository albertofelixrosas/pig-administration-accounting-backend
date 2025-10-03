import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateMovementDto } from './dto/create-movement.dto';
import { UpdateMovementDto } from './dto/update-movement.dto';
import { Movement } from './entities/movement.entity';
import { MovementsService } from './movements.service';

@Controller('movements')
@ApiTags('Movimientos Contables')
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo movimiento contable' })
  @ApiBody({ type: CreateMovementDto })
  @ApiResponse({
    status: 201,
    description: 'Movimiento creado exitosamente',
    type: Movement,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o error en la creación',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createMovementDto: CreateMovementDto,
  ): Promise<Movement> {
    return await this.movementsService.create(createMovementDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los movimientos contables' })
  @ApiResponse({
    status: 200,
    description: 'Lista de movimientos obtenida exitosamente',
    type: [Movement],
  })
  @ApiResponse({
    status: 400,
    description: 'Error obteniendo movimientos',
  })
  async findAll(): Promise<Movement[]> {
    return await this.movementsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un movimiento por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del movimiento',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Movimiento encontrado exitosamente',
    type: Movement,
  })
  @ApiResponse({
    status: 404,
    description: 'Movimiento no encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'ID inválido',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Movement> {
    return await this.movementsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un movimiento' })
  @ApiParam({
    name: 'id',
    description: 'ID del movimiento a actualizar',
    example: 1,
  })
  @ApiBody({ type: UpdateMovementDto })
  @ApiResponse({
    status: 200,
    description: 'Movimiento actualizado exitosamente',
    type: Movement,
  })
  @ApiResponse({
    status: 404,
    description: 'Movimiento no encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o error en la actualización',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovementDto: UpdateMovementDto,
  ): Promise<Movement> {
    return await this.movementsService.update(id, updateMovementDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un movimiento' })
  @ApiParam({
    name: 'id',
    description: 'ID del movimiento a eliminar',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Movimiento eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        deletedMovement: { $ref: '#/components/schemas/Movement' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Movimiento no encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Error eliminando movimiento',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string; deletedMovement: Movement }> {
    return await this.movementsService.remove(id);
  }

  @Get('segment/:segmentId')
  @ApiOperation({ summary: 'Obtener movimientos por segmento' })
  @ApiParam({
    name: 'segmentId',
    description: 'ID del segmento',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Movimientos del segmento obtenidos exitosamente',
    type: [Movement],
  })
  @ApiResponse({
    status: 400,
    description: 'Error obteniendo movimientos del segmento',
  })
  async findBySegment(
    @Param('segmentId', ParseIntPipe) segmentId: number,
  ): Promise<Movement[]> {
    return await this.movementsService.findBySegment(segmentId);
  }

  @Get('account/:accountId')
  @ApiOperation({ summary: 'Obtener movimientos por cuenta contable' })
  @ApiParam({
    name: 'accountId',
    description: 'ID de la cuenta contable',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Movimientos de la cuenta obtenidos exitosamente',
    type: [Movement],
  })
  @ApiResponse({
    status: 400,
    description: 'Error obteniendo movimientos de la cuenta',
  })
  async findByAccount(
    @Param('accountId', ParseIntPipe) accountId: number,
  ): Promise<Movement[]> {
    return await this.movementsService.findByAccountingAccount(accountId);
  }
}
