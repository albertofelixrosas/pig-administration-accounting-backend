import { ApiProperty } from '@nestjs/swagger';

export class WelcomeResponseDto {
  @ApiProperty({
    description: 'Mensaje de bienvenida de la API',
    example: 'Hello World!',
  })
  message: string;
}

export class HealthCheckDto {
  @ApiProperty({
    description: 'Estado de la aplicación',
    example: 'OK',
  })
  status: string;

  @ApiProperty({
    description: 'Timestamp de la verificación',
    example: '2024-10-02T23:45:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Información de la base de datos',
    example: { connected: true, database: 'pig_administration_accounting_dev' },
  })
  database: {
    connected: boolean;
    database: string;
  };
}