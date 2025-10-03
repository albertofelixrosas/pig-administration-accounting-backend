import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConceptsService } from './concepts.service';
import { CreateConceptDto } from './dto/create-concept.dto';
import { UpdateConceptDto } from './dto/update-concept.dto';
import { Concept } from './entities/concept.entity';

@Controller('concepts')
@ApiTags('Concepts')
export class ConceptsController {
  constructor(private readonly conceptsService: ConceptsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo concepto' })
  @ApiResponse({
    status: 201,
    description: 'Concepto creado exitosamente',
    type: Concept,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  create(@Body() createConceptDto: CreateConceptDto): Promise<Concept> {
    return this.conceptsService.create(createConceptDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los conceptos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de conceptos obtenida exitosamente',
    type: [Concept],
  })
  findAll(): Promise<Concept[]> {
    return this.conceptsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un concepto por ID' })
  @ApiParam({ name: 'id', description: 'ID del concepto', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Concepto encontrado',
    type: Concept,
  })
  @ApiResponse({ status: 404, description: 'Concepto no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Concept> {
    return this.conceptsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un concepto' })
  @ApiParam({ name: 'id', description: 'ID del concepto', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Concepto actualizado exitosamente',
    type: Concept,
  })
  @ApiResponse({ status: 404, description: 'Concepto no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateConceptDto: UpdateConceptDto,
  ): Promise<Concept> {
    return this.conceptsService.update(id, updateConceptDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un concepto' })
  @ApiParam({ name: 'id', description: 'ID del concepto', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Concepto eliminado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Concepto no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.conceptsService.remove(id);
  }
}
