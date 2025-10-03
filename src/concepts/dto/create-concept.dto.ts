import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateConceptDto {
  @ApiProperty({
    description: 'Nombre del concepto',
    example: 'Gastos de Oficina',
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'El nombre del concepto es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(255, { message: 'El nombre no puede exceder 255 caracteres' })
  name: string;
}
