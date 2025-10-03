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
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateSegmentDto } from './dto/create-segment.dto';
import { UpdateSegmentDto } from './dto/update-segment.dto';
import { Segment } from './entities/segment.entity';
import { SegmentsService } from './segments.service';

@Controller('segments')
@ApiTags('Segmentos')
export class SegmentsController {
  constructor(private readonly segmentsService: SegmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo segmento' })
  @ApiBody({ type: CreateSegmentDto })
  @ApiResponse({
    status: 201,
    description: 'Segmento creado exitosamente',
    type: Segment,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o error en la creación',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un segmento con ese código',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createSegmentDto: CreateSegmentDto): Promise<Segment> {
    return await this.segmentsService.create(createSegmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los segmentos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de segmentos obtenida exitosamente',
    type: [Segment],
  })
  @ApiResponse({
    status: 400,
    description: 'Error obteniendo segmentos',
  })
  async findAll(): Promise<Segment[]> {
    return await this.segmentsService.findAll();
  }

  @Get('by-code')
  @ApiOperation({ summary: 'Buscar segmento por código' })
  @ApiQuery({
    name: 'code',
    description: 'Código del segmento a buscar',
    example: 'SEG-001',
  })
  @ApiResponse({
    status: 200,
    description: 'Segmento encontrado o null si no existe',
    type: Segment,
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la búsqueda',
  })
  async findByCode(@Query('code') code: string): Promise<Segment | null> {
    return await this.segmentsService.findByCode(code);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un segmento por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del segmento',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Segmento encontrado exitosamente',
    type: Segment,
  })
  @ApiResponse({
    status: 404,
    description: 'Segmento no encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'ID inválido',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Segment> {
    return await this.segmentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un segmento' })
  @ApiParam({
    name: 'id',
    description: 'ID del segmento a actualizar',
    example: 1,
  })
  @ApiBody({ type: UpdateSegmentDto })
  @ApiResponse({
    status: 200,
    description: 'Segmento actualizado exitosamente',
    type: Segment,
  })
  @ApiResponse({
    status: 404,
    description: 'Segmento no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un segmento con ese código',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o error en la actualización',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSegmentDto: UpdateSegmentDto,
  ): Promise<Segment> {
    return await this.segmentsService.update(id, updateSegmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un segmento' })
  @ApiParam({
    name: 'id',
    description: 'ID del segmento a eliminar',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Segmento eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        deletedSegment: { $ref: '#/components/schemas/Segment' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Segmento no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'No se puede eliminar porque tiene movimientos asociados',
  })
  @ApiResponse({
    status: 400,
    description: 'Error eliminando segmento',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string; deletedSegment: Segment }> {
    return await this.segmentsService.remove(id);
  }
}
