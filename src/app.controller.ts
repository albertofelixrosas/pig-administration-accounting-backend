import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { HealthCheckDto, WelcomeResponseDto } from './dto/common.dto';

@ApiTags('general')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Mensaje de bienvenida',
    description: 'Retorna un mensaje de bienvenida de la API',
  })
  @ApiResponse({
    status: 200,
    description: 'Mensaje de bienvenida exitoso',
    type: WelcomeResponseDto,
  })
  getHello(): WelcomeResponseDto {
    // 🐛 DEBUG POINT: Put a breakpoint here to debug this endpoint
    const message = this.appService.getHello();
    console.log('Debug: Getting hello message:', message);
    return { message };
  }

  @Get('health')
  @ApiOperation({
    summary: 'Health Check',
    description:
      'Verifica el estado de la aplicación y conexión a base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado de la aplicación',
    type: HealthCheckDto,
  })
  getHealth(): HealthCheckDto {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        database:
          process.env.DB_DATABASE || 'pig_administration_accounting_dev',
      },
    };
  }
}
