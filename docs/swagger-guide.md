# Guía de Uso de Swagger en NestJS

Esta guía muestra cómo documentar efectivamente tu API usando los decoradores de Swagger en NestJS.

## Decoradores Principales

### @ApiTags
Agrupa endpoints relacionados bajo una etiqueta específica.

```typescript
@ApiTags('users')
@Controller('users')
export class UsersController {
  // endpoints aquí
}
```

### @ApiOperation
Describe el propósito del endpoint.

```typescript
@Get()
@ApiOperation({ 
  summary: 'Obtener todos los usuarios',
  description: 'Retorna una lista paginada de usuarios registrados en el sistema'
})
getAllUsers() {
  // implementación
}
```

### @ApiResponse
Documenta las posibles respuestas del endpoint.

```typescript
@Get(':id')
@ApiResponse({ 
  status: 200, 
  description: 'Usuario encontrado exitosamente',
  type: UserResponseDto 
})
@ApiResponse({ 
  status: 404, 
  description: 'Usuario no encontrado' 
})
@ApiResponse({ 
  status: 401, 
  description: 'No autorizado' 
})
getUser(@Param('id') id: number) {
  // implementación
}
```

### @ApiParam
Documenta parámetros de ruta.

```typescript
@Get(':id')
@ApiParam({ 
  name: 'id', 
  type: Number, 
  description: 'ID único del usuario', 
  example: 1 
})
getUser(@Param('id') id: number) {
  // implementación
}
```

### @ApiQuery
Documenta parámetros de consulta.

```typescript
@Get()
@ApiQuery({ 
  name: 'page', 
  required: false, 
  type: Number, 
  description: 'Número de página', 
  example: 1 
})
@ApiQuery({ 
  name: 'limit', 
  required: false, 
  type: Number, 
  description: 'Elementos por página', 
  example: 10 
})
@ApiQuery({ 
  name: 'search', 
  required: false, 
  type: String, 
  description: 'Término de búsqueda', 
  example: 'john' 
})
findAll(
  @Query('page') page?: number,
  @Query('limit') limit?: number,
  @Query('search') search?: string,
) {
  // implementación
}
```

### @ApiBody
Documenta el cuerpo de la petición.

```typescript
@Post()
@ApiBody({ 
  type: CreateUserDto, 
  description: 'Datos del usuario a crear',
  examples: {
    'ejemplo1': {
      summary: 'Usuario básico',
      value: {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        age: 30
      }
    },
    'ejemplo2': {
      summary: 'Usuario completo',
      value: {
        name: 'María García',
        email: 'maria@example.com',
        age: 25,
        phone: '+1234567890',
        address: 'Calle 123, Ciudad'
      }
    }
  }
})
create(@Body() createUserDto: CreateUserDto) {
  // implementación
}
```

### @ApiBearerAuth
Indica que el endpoint requiere autenticación JWT.

```typescript
@Get('profile')
@ApiBearerAuth('JWT-auth')
@ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
getProfile(@Request() req) {
  // implementación
}
```

## DTOs con Swagger

### @ApiProperty
Documenta propiedades obligatorias.

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
    minLength: 2,
    maxLength: 100,
  })
  name: string;

  @ApiProperty({
    description: 'Correo electrónico único',
    example: 'juan@example.com',
    format: 'email',
  })
  email: string;

  @ApiProperty({
    description: 'Edad del usuario',
    example: 25,
    minimum: 18,
    maximum: 120,
  })
  age: number;

  @ApiProperty({
    description: 'Género del usuario',
    example: 'M',
    enum: ['M', 'F', 'O'],
  })
  gender: 'M' | 'F' | 'O';
}
```

### @ApiPropertyOptional
Documenta propiedades opcionales.

```typescript
export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez Actualizado',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono',
    example: '+1234567890',
    pattern: '^\\+?[1-9]\\d{1,14}$',
  })
  phone?: string;
}
```

## Configuración Avanzada en main.ts

```typescript
const config = new DocumentBuilder()
  .setTitle('Mi API')
  .setDescription('Descripción detallada de mi API')
  .setVersion('1.0')
  .addTag('users', 'Gestión de usuarios')
  .addTag('auth', 'Autenticación')
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
  .addServer('http://localhost:3000', 'Desarrollo')
  .addServer('https://api.example.com', 'Producción')
  .setContact('Equipo de Desarrollo', 'https://example.com', 'dev@example.com')
  .setLicense('MIT', 'https://opensource.org/licenses/MIT')
  .build();
```

## Tipos de Respuesta Personalizados

```typescript
// Para respuestas complejas
@ApiResponse({
  status: 200,
  description: 'Lista de usuarios paginada',
  schema: {
    type: 'object',
    properties: {
      data: {
        type: 'array',
        items: { $ref: getSchemaPath(UserResponseDto) }
      },
      meta: {
        type: 'object',
        properties: {
          total: { type: 'number', example: 100 },
          page: { type: 'number', example: 1 },
          limit: { type: 'number', example: 10 },
          totalPages: { type: 'number', example: 10 }
        }
      }
    }
  }
})
```

## Ejemplos de Validación

```typescript
export class CreateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Laptop Gaming',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Precio del producto',
    example: 1299.99,
    minimum: 0,
    type: 'number',
    format: 'float',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    description: 'Categorías del producto',
    example: ['electronics', 'computers'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];
}
```

## Consejos de Mejores Prácticas

1. **Siempre documenta las respuestas de error**: 400, 401, 403, 404, 500
2. **Usa ejemplos realistas**: Ayuda a los consumidores de la API
3. **Agrupa endpoints relacionados**: Usa @ApiTags consistentemente
4. **Documenta autenticación**: Especifica qué endpoints requieren auth
5. **Valida consistentemente**: Usa class-transformer y class-validator
6. **Versiona tu API**: Incluye información de versión en la configuración

## Tema "One Dark" Profesional

El tema está configurado usando la librería `swagger-themes` con el tema "One Dark":

```typescript
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

// Initialize swagger-themes with "one-dark" theme
const theme = new SwaggerTheme();
const oneDarkTheme = theme.getBuffer(SwaggerThemeNameEnum.ONE_DARK);

SwaggerModule.setup('api', app, document, {
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'none',
    filter: true,
    showRequestHeaders: true,
    tryItOutEnabled: true,
    displayOperationId: false,
  },
  customCss: oneDarkTheme,
  customSiteTitle: 'Pig Administration API Docs',
});
```

### Temas Disponibles en swagger-themes

La librería `swagger-themes` ofrece varios temas profesionales:

- `ONE_DARK` - Tema oscuro elegante (actual)
- `DRACULA` - Tema Dracula
- `GRUVBOX` - Tema Gruvbox
- `MONOKAI` - Tema Monokai
- `NORD` - Tema Nord
- `OUTLINE` - Tema claro con contornos
- `CLASSIC` - Tema clásico de Swagger

Para cambiar el tema, simplemente modifica:
```typescript
const newTheme = theme.getBuffer(SwaggerThemeNameEnum.DRACULA); // o cualquier otro tema
```