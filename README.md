# Pig Administration Accounting Backend

Backend application for pig administration and accounting system built with NestJS, TypeORM, and SQLite.

## Description

This is a NestJS-based backend application designed to handle pig administration and accounting operations with a SQLite database for simplified development and deployment.

## Prerequisites

- Node.js (v16 or higher)
- No additional database installation required (SQLite included)

## Installation

```bash
npm install
```

## Database Setup

### Automatic SQLite Setup

The application uses SQLite for simplified development and deployment. No manual database setup is required:

- **Development**: Creates `database_dev.sqlite` automatically
- **Production**: Creates `database.sqlite` automatically
- **Auto-sync**: Database schema synchronization enabled
- **Portable**: Single file database, easy to backup and move

## Environment Configuration

1. Copy the environment file for your environment:

   ```bash
   # For development
   cp .env.development .env

   # Or for production
   cp .env.production .env
   ```

2. The `.env` file only needs the database filename (already configured):

   ```env
   # Development
   DB_DATABASE=database_dev.sqlite

   # Production
   DB_DATABASE=database.sqlite
   ```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Project Structure

```
src/
├── config/
│   └── database.config.ts   # Database configuration service
├── database/
│   └── database.module.ts   # Database module
├── entities/
│   └── user.entity.ts       # Example entity
├── app.controller.ts        # Main application controller
├── app.module.ts           # Root module with database configuration
├── app.service.ts          # Main application service
└── main.ts                 # Application entry point
├── concepts/                # Concepts CRUD module
├── accounting-accounts/     # Accounting accounts module
├── segments/               # Segments module
├── movements/              # Movements module
└── contpaq-excel/          # Excel file processing module
```

## Environment Files

- `.env.example` - Template with all available environment variables
- `.env.development` - Development environment configuration
- `.env.production` - Production environment configuration

## Database Features

- **SQLite Integration**: Lightweight, file-based database
- **TypeORM Integration**: Full ORM support with decorators
- **Auto-sync**: Database schema synchronization enabled
- **Portable**: Single file database, easy backup and deployment
- **Zero Configuration**: No server setup required
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality

## API Documentation

### Swagger UI

La aplicación incluye documentación interactiva de la API usando Swagger UI con el tema profesional "One Dark".

- **URL**: http://localhost:3000/api
- **Tema**: "One Dark" (usando swagger-themes)
- **Características**:
  - Documentación interactiva completa
  - Pruebas de endpoints en vivo
  - Autenticación JWT integrada
  - Esquemas de datos detallados
  - Ejemplos de request/response
  - Tema oscuro profesional y elegante
  - Persistencia de autorización
  - Filtros y búsqueda integrados

### API Endpoints

#### General

- `GET /` - Mensaje de bienvenida
- `GET /health` - Health check con estado de la aplicación

#### Concepts (Conceptos Contables)

- `GET /concepts` - Lista todos los conceptos ordenados alfabéticamente
- `GET /concepts/:id` - Obtener concepto por ID
- `POST /concepts` - Crear nuevo concepto
- `PATCH /concepts/:id` - Actualizar concepto
- `DELETE /concepts/:id` - Eliminar concepto

#### ContPAQ Excel (Procesamiento de Archivos)

- `POST /contpaq-excel/upload` - Cargar y procesar archivo Excel

#### Pigs (Gestión de Cerdos) - Ejemplo

- `GET /pigs` - Lista paginada de cerdos con filtros
- `GET /pigs/:id` - Obtener cerdo por ID
- `POST /pigs` - Crear nuevo cerdo
- `PUT /pigs/:id` - Actualizar cerdo
- `DELETE /pigs/:id` - Eliminar cerdo

### Configuración de Swagger

Swagger está habilitado por defecto en desarrollo y puede configurarse mediante variables de entorno:

```env
SWAGGER_ENABLED=true    # Habilitar/deshabilitar Swagger
SWAGGER_PATH=api        # Ruta donde se sirve la documentación
```

## Technologies Used

- **Backend**: NestJS, TypeScript
- **Database**: SQLite, TypeORM
- **File Processing**: ExcelJS, Multer
- **API Documentation**: Swagger/OpenAPI 3.0 con tema "One Dark"
- **Theme**: swagger-themes (One Dark theme)
- **Validation**: class-validator, class-transformer
- **Configuration**: @nestjs/config with environment variables
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier

## Development Workflow

### Inicio Rápido

1. **Install dependencies**: `npm install`
2. **Set up environment**: `cp .env.development .env` (Windows: `copy .env.development .env`)
3. **Start development server**: `npm run start:dev`
4. **Open Swagger documentation**: http://localhost:3000/api

¡Eso es todo! La base de datos SQLite se crea automáticamente.

### Funcionalidades Disponibles

1. **Swagger API**: http://localhost:3000/api - Documentación interactiva con tema oscuro
2. **CRUD de Conceptos**: Completamente funcional desde Swagger
3. **Carga de Excel**: Endpoint para procesar archivos Excel de ContPAQ
4. **Base de datos**: SQLite con todas las tablas creadas automáticamente

### Useful Commands

```bash
# Database management
npm run db:reset    # Reset SQLite database (remove database file)

# Development
npm run start:dev   # Start with hot reload
npm run build      # Build for production
npm run start:prod # Start production server

# Debugging
npm run debug       # Debug with ts-node (no reload)
npm run debug:watch # Debug with nodemon (hot reload)
npm run debug:inspect # Debug with inspector (for attach)
```

## 🐛 Debugging

El proyecto está configurado para debugging con VS Code usando `ts-node`:

### Configuraciones Disponibles:

1. **Debug NestJS (ts-node)** - Debug básico sin hot reload
2. **Debug NestJS with Watch (nodemon)** - Debug con hot reload
3. **Debug Tests (Jest)** - Debug de tests
4. **Attach to NestJS** - Attach a proceso existente

### Cómo Debuggear:

1. Ir a "Run and Debug" (Ctrl+Shift+D)
2. Seleccionar configuración deseada
3. Presionar F5 o click en play
4. Poner breakpoints en el código TypeScript
5. Hacer requests a la API para activar breakpoints

Ver `docs/debugging-guide.md` para guía completa de debugging.

## License

This project is private and unlicensed.
