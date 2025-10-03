import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: '*',
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Quita propiedades no definidas en DTO
      forbidNonWhitelisted: true, // Lanza error si vienen propiedades no permitidas
      forbidUnknownValues: true, // Asegura que los objetos no sean null o undefined
      transform: true, // Convierte tipos automáticamente (por ejemplo, de string a number)
    }),
  );

  // Global interceptor for entity serialization
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  const swaggerEnabled = configService.get<boolean>('SWAGGER_ENABLED', true);
  const swaggerPath = configService.get<string>('SWAGGER_PATH', 'api');

  // Swagger Configuration - Only enable in development or when explicitly enabled
  if (swaggerEnabled && nodeEnv !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Pig Administration Accounting API')
      .setDescription(
        'API para el sistema de administración y contabilidad porcina',
      )
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);

    // Configure One Dark theme exactly like your working example
    const choosedTheme: SwaggerThemeNameEnum = SwaggerThemeNameEnum.ONE_DARK;
    const theme = new SwaggerTheme();
    const darkTheme = theme.getBuffer(choosedTheme);

    SwaggerModule.setup(swaggerPath, app, document, {
      customCss: darkTheme,
      swaggerOptions: {
        persistAuthorization: true, // mantiene el token aunque recargues la página
        displayRequestDuration: true,
        docExpansion: 'none',
        filter: true,
        showRequestHeaders: true,
        tryItOutEnabled: true,
        displayOperationId: false,
      },
      customSiteTitle: 'Pig Administration API Docs',
      customfavIcon: '/favicon.ico',
    });
  }

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);

  if (swaggerEnabled && nodeEnv !== 'production') {
    console.log(
      `Swagger documentation available at: http://localhost:${port}/${swaggerPath}`,
    );
  }
}
bootstrap();
