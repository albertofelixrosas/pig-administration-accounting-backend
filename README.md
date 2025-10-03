# Pig Administration Accounting Backend

Backend application for pig administration and accounting system built with NestJS, TypeORM, and PostgreSQL.

## Description

This is a NestJS-based backend application designed to handle pig administration and accounting operations with a PostgreSQL database.

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL 16
- Docker & Docker Compose (optional, for local development)

## Installation

```bash
npm install
```

## Database Setup

### Option 1: Using Docker Compose (Recommended for development)

```bash
# Start PostgreSQL and pgAdmin containers
docker-compose up -d

# The database will be available at:
# - PostgreSQL: localhost:5432
# - pgAdmin: http://localhost:8080 (admin@admin.com / admin)
```

### Option 2: Manual PostgreSQL installation

1. Install PostgreSQL 16
2. Create databases:
   ```sql
   CREATE DATABASE pig_administration_accounting_dev;
   CREATE DATABASE pig_administration_accounting_prod;
   ```

## Environment Configuration

1. Copy the environment file for your environment:

   ```bash
   # For development
   cp .env.development .env

   # Or for production
   cp .env.production .env
   ```

2. Update the `.env` file with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_DATABASE=pig_administration_accounting_dev
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
database/
└── init.sql                # Database initialization script
```

## Environment Files

- `.env.example` - Template with all available environment variables
- `.env.development` - Development environment configuration
- `.env.production` - Production environment configuration

## Database Features

- **TypeORM Integration**: Full ORM support with decorators
- **PostgreSQL 16**: Latest stable version with advanced features
- **Auto-sync**: Database schema synchronization in development
- **Migrations**: Production-ready database versioning (to be implemented)
- **Connection Pooling**: Optimized database connections

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

#### Pigs (Gestión de Cerdos)

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
- **Database**: PostgreSQL 16, TypeORM
- **API Documentation**: Swagger/OpenAPI 3.0 con tema "One Dark"
- **Theme**: swagger-themes (One Dark theme)
- **Configuration**: @nestjs/config with environment variables
- **Development**: Docker Compose, pgAdmin
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier

## Development Workflow

### Inicio Rápido (Solo API con Swagger)

1. Install dependencies: `npm install`
2. Set up environment: `cp .env.development .env` (Windows: `copy .env.development .env`)
3. Start development server: `npm run start:dev`
4. Open Swagger documentation: http://localhost:3000/api

### Con Base de Datos Completa

1. Start the database: `docker-compose up -d` o instalar PostgreSQL manualmente
2. Run database setup script: `scripts/setup-database.bat` (Windows) o `scripts/setup-database.sh` (Linux/Mac)
3. Uncomment database configuration in `src/database/database.module.ts`
4. Install dependencies: `npm install`
5. Set up environment: Update `.env` with your database credentials
6. Start development server: `npm run start:dev`
7. Access pgAdmin at http://localhost:8080 for database management
8. Open Swagger documentation: http://localhost:3000/api

### Useful Commands

```bash
# Database management
npm run db:start    # Start PostgreSQL container
npm run db:stop     # Stop PostgreSQL container
npm run db:reset    # Reset database (remove all data)

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
