import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePigDto, PigResponseDto, UpdatePigDto } from '../dto/pig.dto';

@ApiTags('pigs')
@ApiBearerAuth('JWT-auth')
@Controller('pigs')
export class PigController {
  @Get()
  @ApiOperation({
    summary: 'Obtener lista de cerdos',
    description:
      'Retorna una lista paginada de todos los cerdos registrados en el sistema',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Elementos por página',
    example: 10,
  })
  @ApiQuery({
    name: 'breed',
    required: false,
    type: String,
    description: 'Filtrar por raza',
    example: 'Yorkshire',
  })
  @ApiQuery({
    name: 'farmId',
    required: false,
    type: Number,
    description: 'Filtrar por granja',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de cerdos obtenida exitosamente',
    type: [PigResponseDto],
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('breed') breed?: string,
    @Query('farmId') farmId?: number,
  ): PigResponseDto[] {
    // 🐛 DEBUG POINT: Put a breakpoint here to inspect query parameters
    console.log('Debug - Query parameters:', { page, limit, breed, farmId });

    // Mock data for demonstration
    const mockPigs = [
      {
        id: 1,
        tagId: 'PIG-001',
        breed: 'Yorkshire',
        gender: 'M' as const,
        birthDate: new Date('2024-01-15'),
        currentWeight: 45.5,
        notes: 'Cerdo saludable',
        farmId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // 🐛 DEBUG POINT: Put a breakpoint here to inspect the response
    console.log('Debug - Returning pigs:', mockPigs.length);
    return mockPigs;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener cerdo por ID',
    description: 'Retorna la información detallada de un cerdo específico',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID único del cerdo',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Cerdo encontrado exitosamente',
    type: PigResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Cerdo no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findOne(@Param('id') id: number): PigResponseDto {
    return {
      id: 1,
      tagId: 'PIG-001',
      breed: 'Yorkshire',
      gender: 'M',
      birthDate: new Date('2024-01-15'),
      currentWeight: 45.5,
      notes: 'Cerdo saludable',
      farmId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  @Post()
  @ApiOperation({
    summary: 'Crear nuevo cerdo',
    description: 'Registra un nuevo cerdo en el sistema',
  })
  @ApiBody({ type: CreatePigDto, description: 'Datos del cerdo a crear' })
  @ApiResponse({
    status: 201,
    description: 'Cerdo creado exitosamente',
    type: PigResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 409, description: 'El tagId ya existe' })
  create(@Body() createPigDto: CreatePigDto): PigResponseDto {
    return {
      id: 1,
      tagId: createPigDto.tagId,
      breed: createPigDto.breed,
      gender: createPigDto.gender,
      birthDate: createPigDto.birthDate,
      currentWeight: createPigDto.currentWeight,
      notes: createPigDto.notes,
      farmId: createPigDto.farmId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar cerdo',
    description: 'Actualiza la información de un cerdo existente',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID único del cerdo',
    example: 1,
  })
  @ApiBody({ type: UpdatePigDto, description: 'Datos del cerdo a actualizar' })
  @ApiResponse({
    status: 200,
    description: 'Cerdo actualizado exitosamente',
    type: PigResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Cerdo no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  update(
    @Param('id') id: number,
    @Body() updatePigDto: UpdatePigDto,
  ): PigResponseDto {
    return {
      id,
      tagId: 'PIG-001',
      breed: 'Yorkshire',
      gender: 'M',
      birthDate: new Date('2024-01-15'),
      currentWeight: updatePigDto.currentWeight || 45.5,
      notes: updatePigDto.notes || 'Cerdo saludable',
      farmId: updatePigDto.farmId || 1,
      createdAt: new Date('2024-10-01'),
      updatedAt: new Date(),
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar cerdo',
    description: 'Elimina un cerdo del sistema',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID único del cerdo',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Cerdo eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Cerdo eliminado exitosamente' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Cerdo no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  remove(@Param('id') id: number): { message: string } {
    return { message: 'Cerdo eliminado exitosamente' };
  }
}
