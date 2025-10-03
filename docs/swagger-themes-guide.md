# Configuración de Temas para Swagger

Este archivo contiene ejemplos de configuración para diferentes temas de Swagger usando la librería `swagger-themes`.

## Instalación

```bash
npm install swagger-themes
```

## Configuración Actual (One Dark)

```typescript
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

const theme = new SwaggerTheme();
const oneDarkTheme = theme.getBuffer(SwaggerThemeNameEnum.ONE_DARK);

SwaggerModule.setup('api', app, document, {
  customCss: oneDarkTheme,
  // ... otras opciones
});
```

## Temas Disponibles

### 1. One Dark (Actual)
```typescript
const theme = theme.getBuffer(SwaggerThemeNameEnum.ONE_DARK);
```
- **Descripción**: Tema oscuro elegante y profesional
- **Colores**: Fondo negro/gris oscuro con acentos en azul y verde
- **Recomendado para**: Desarrollo nocturno, interfaces profesionales

### 2. Dracula
```typescript
const theme = theme.getBuffer(SwaggerThemeNameEnum.DRACULA);
```
- **Descripción**: Tema oscuro con acentos púrpura
- **Colores**: Fondo oscuro con acentos en púrpura, rosa y cyan
- **Recomendado para**: Desarrolladores que prefieren colores vibrantes

### 3. Gruvbox
```typescript
const theme = theme.getBuffer(SwaggerThemeNameEnum.GRUVBOX);
```
- **Descripción**: Tema retro con colores cálidos
- **Colores**: Tonos tierra con acentos en naranja y amarillo
- **Recomendado para**: Interfaz más cálida y relajante

### 4. Monokai
```typescript
const theme = theme.getBuffer(SwaggerThemeNameEnum.MONOKAI);
```
- **Descripción**: Tema oscuro clásico de editores
- **Colores**: Fondo negro con acentos en verde, amarillo y rosa
- **Recomendado para**: Desarrolladores familiarizados con Sublime Text

### 5. Nord
```typescript
const theme = theme.getBuffer(SwaggerThemeNameEnum.NORD);
```
- **Descripción**: Tema ártico con tonos fríos
- **Colores**: Paleta de azules y grises inspirada en el ártico
- **Recomendado para**: Interfaz minimalista y moderna

### 6. Outline
```typescript
const theme = theme.getBuffer(SwaggerThemeNameEnum.OUTLINE);
```
- **Descripción**: Tema claro con contornos definidos
- **Colores**: Fondo blanco con bordes y contornos marcados
- **Recomendado para**: Usuarios que prefieren temas claros

### 7. Classic
```typescript
const theme = theme.getBuffer(SwaggerThemeNameEnum.CLASSIC);
```
- **Descripción**: Tema clásico de Swagger UI
- **Colores**: Colores originales de Swagger
- **Recomendado para**: Mantener la apariencia estándar

## Configuración Completa de Ejemplo

```typescript
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Mi API')
    .setDescription('Descripción de mi API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Aplicar tema
  const theme = new SwaggerTheme();
  const selectedTheme = theme.getBuffer(SwaggerThemeNameEnum.ONE_DARK);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      tryItOutEnabled: true,
    },
    customCss: selectedTheme,
    customSiteTitle: 'Mi API Docs',
    customfavIcon: '/favicon.ico',
  });

  await app.listen(3000);
}
bootstrap();
```

## Cambiar Tema

Para cambiar el tema, simplemente modifica la línea en `src/main.ts`:

```typescript
// Cambiar de ONE_DARK a DRACULA
const selectedTheme = theme.getBuffer(SwaggerThemeNameEnum.DRACULA);
```

## Personalización Adicional

Puedes combinar temas con CSS personalizado:

```typescript
const customCss = selectedTheme + `
  .swagger-ui .topbar {
    display: none;
  }
  .swagger-ui .info .title {
    color: #your-color !important;
  }
`;

SwaggerModule.setup('api', app, document, {
  customCss: customCss,
  // ... otras opciones
});
```

## Variables de Entorno para Temas

Puedes hacer el tema configurable via variables de entorno:

```typescript
// En .env
SWAGGER_THEME=ONE_DARK

// En main.ts
const themeName = process.env.SWAGGER_THEME || 'ONE_DARK';
const selectedTheme = theme.getBuffer(SwaggerThemeNameEnum[themeName]);
```

## Referencias

- [swagger-themes en npm](https://www.npmjs.com/package/swagger-themes)
- [Repositorio de swagger-themes](https://github.com/ostranme/swagger-themes)
- [Documentación de Swagger UI](https://swagger.io/docs/open-source-tools/swagger-ui/)