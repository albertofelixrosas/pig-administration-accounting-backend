import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

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
    type: String,
  })
  getHello() {
    // 🐛 DEBUG POINT: Put a breakpoint here to debug this endpoint
    const message = this.appService.getHello();
    console.log('Debug: Getting hello message:', message);
    return message;
  }
}
