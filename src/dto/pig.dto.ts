import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePigDto {
  @ApiProperty({
    description: 'Identificador único del cerdo',
    example: 'PIG-001',
    minLength: 3,
    maxLength: 50,
  })
  tagId: string;

  @ApiProperty({
    description: 'Raza del cerdo',
    example: 'Yorkshire',
    enum: ['Yorkshire', 'Landrace', 'Duroc', 'Hampshire', 'Pietrain', 'Large White'],
  })
  breed: string;

  @ApiProperty({
    description: 'Sexo del cerdo',
    example: 'M',
    enum: ['M', 'F'],
  })
  gender: 'M' | 'F';

  @ApiProperty({
    description: 'Fecha de nacimiento',
    example: '2024-01-15',
    type: Date,
  })
  birthDate: Date;

  @ApiProperty({
    description: 'Peso actual en kilogramos',
    example: 45.5,
    minimum: 0,
    maximum: 500,
  })
  currentWeight: number;

  @ApiPropertyOptional({
    description: 'Notas adicionales sobre el cerdo',
    example: 'Cerdo saludable, vacunado al día',
  })
  notes?: string;

  @ApiProperty({
    description: 'ID de la granja donde se encuentra',
    example: 1,
  })
  farmId: number;
}

export class UpdatePigDto {
  @ApiPropertyOptional({
    description: 'Peso actual en kilogramos',
    example: 47.2,
    minimum: 0,
    maximum: 500,
  })
  currentWeight?: number;

  @ApiPropertyOptional({
    description: 'Notas adicionales sobre el cerdo',
    example: 'Actualización de estado de salud',
  })
  notes?: string;

  @ApiPropertyOptional({
    description: 'ID de la granja donde se encuentra',
    example: 2,
  })
  farmId?: number;
}

export class PigResponseDto {
  @ApiProperty({
    description: 'ID único del cerdo',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Identificador único del cerdo',
    example: 'PIG-001',
  })
  tagId: string;

  @ApiProperty({
    description: 'Raza del cerdo',
    example: 'Yorkshire',
  })
  breed: string;

  @ApiProperty({
    description: 'Sexo del cerdo',
    example: 'M',
  })
  gender: string;

  @ApiProperty({
    description: 'Fecha de nacimiento',
    example: '2024-01-15T00:00:00.000Z',
  })
  birthDate: Date;

  @ApiProperty({
    description: 'Peso actual en kilogramos',
    example: 45.5,
  })
  currentWeight: number;

  @ApiPropertyOptional({
    description: 'Notas adicionales sobre el cerdo',
    example: 'Cerdo saludable, vacunado al día',
  })
  notes?: string;

  @ApiProperty({
    description: 'ID de la granja donde se encuentra',
    example: 1,
  })
  farmId: number;

  @ApiProperty({
    description: 'Fecha de creación del registro',
    example: '2024-10-02T23:45:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-10-02T23:45:00.000Z',
  })
  updatedAt: Date;
}