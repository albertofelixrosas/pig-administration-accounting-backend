import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateMovementDto {
  @ApiProperty({
    description: 'ID del segmento asociado al movimiento',
    example: 1,
  })
  @IsNumber()
  @Min(1)
  segmentId: number;

  @ApiProperty({
    description: 'ID de la cuenta contable asociada al movimiento',
    example: 1,
  })
  @IsNumber()
  @Min(1)
  accountingAccountId: number;

  @ApiProperty({
    description: 'Fecha del movimiento en formato ISO (YYYY-MM-DD)',
    example: '2025-10-02',
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Tipo de movimiento',
    enum: ['Egresos', 'Ingresos'],
    example: 'Egresos',
  })
  @IsEnum(['Egresos', 'Ingresos'], {
    message: 'El tipo debe ser "Egresos" o "Ingresos"',
  })
  type: 'Egresos' | 'Ingresos';

  @ApiProperty({
    description: 'Número del movimiento',
    example: 1001,
  })
  @IsNumber()
  @Min(1)
  number: number;

  @ApiProperty({
    description: 'Proveedor o cliente relacionado con el movimiento',
    example: 'Proveedor ABC S.A. de C.V.',
  })
  @IsString()
  @IsNotEmpty()
  supplier: string;

  @ApiProperty({
    description: 'Concepto o descripción del movimiento',
    example: 'Compra de materiales para oficina',
  })
  @IsString()
  @IsNotEmpty()
  concept: string;

  @ApiProperty({
    description: 'Referencia del movimiento (factura, recibo, etc.)',
    example: 'FAC-001-2025',
  })
  @IsString()
  @IsNotEmpty()
  reference: string;

  @ApiProperty({
    description: 'Monto del cargo (puede ser null)',
    example: 1500.5,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }) =>
    value === '' || value === null ? null : parseFloat(value),
  )
  charge?: number | null;
}
