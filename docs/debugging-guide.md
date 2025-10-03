# Guía de Debugging para NestJS con VS Code

Esta guía explica cómo debuggear la aplicación NestJS usando VS Code con `ts-node`.

## 🚀 Configuraciones de Debug Disponibles

### 1. Debug NestJS (ts-node)

**Uso principal**: Debug básico sin hot reload

**Cómo usar**:

1. Ir a la pestaña de "Run and Debug" (Ctrl+Shift+D)
2. Seleccionar "Debug NestJS (ts-node)"
3. Presionar F5 o hacer clic en el botón play

**Características**:

- ✅ Breakpoints en TypeScript
- ✅ Variables de entorno cargadas desde .env
- ✅ Source maps habilitados
- ✅ Skip node internals

### 2. Debug NestJS with Watch (nodemon)

**Uso principal**: Debug con hot reload automático

**Cómo usar**:

1. Ir a la pestaña de "Run and Debug" (Ctrl+Shift+D)
2. Seleccionar "Debug NestJS with Watch (nodemon)"
3. Presionar F5 o hacer clic en el botón play

**Características**:

- ✅ Hot reload automático
- ✅ Watch de archivos TypeScript
- ✅ Reinicio automático en cambios
- ✅ Breakpoints persistentes

### 3. Debug Tests (Jest)

**Uso principal**: Debug de tests E2E

**Cómo usar**:

1. Seleccionar "Debug Tests (Jest)"
2. Presionar F5

**Características**:

- ✅ Debug de tests unitarios y E2E
- ✅ Breakpoints en archivos de test
- ✅ Variables de entorno de test

### 4. Attach to NestJS

**Uso principal**: Attachear a un proceso NestJS ya corriendo

**Cómo usar**:

1. Iniciar la aplicación con `npm run debug:inspect`
2. Seleccionar "Attach to NestJS"
3. Presionar F5

## 📝 Scripts NPM para Debugging

```json
{
  "debug": "node -r ts-node/register -r tsconfig-paths/register src/main.ts",
  "debug:watch": "nodemon --exec \"node -r ts-node/register -r tsconfig-paths/register\" src/main.ts",
  "debug:inspect": "node --inspect-brk -r ts-node/register -r tsconfig-paths/register src/main.ts"
}
```

### Explicación de Scripts:

**`npm run debug`**

- Ejecuta la aplicación con ts-node
- Sin hot reload
- Útil para debugging básico

**`npm run debug:watch`**

- Ejecuta con nodemon para hot reload
- Reinicia automáticamente en cambios
- Mejor para desarrollo con debugging

**`npm run debug:inspect`**

- Inicia con inspector pausado
- Espera conexión del debugger
- Útil para attach debugging

## 🔧 Configuración de Nodemon

El archivo `nodemon.json` está configurado para:

```json
{
  "watch": ["src"],
  "ext": "ts,js,json",
  "ignore": ["src/**/*.spec.ts", "src/**/*.test.ts", "node_modules", "dist"],
  "delay": 1000
}
```

## 📍 Cómo Usar Breakpoints

### 1. Breakpoints Básicos

- Hacer clic en el margen izquierdo del editor
- Línea roja indica breakpoint activo
- F9 para toggle breakpoint en línea actual

### 2. Breakpoints Condicionales

- Click derecho en breakpoint existente
- Seleccionar "Edit Breakpoint"
- Agregar condición (ej: `userId === 123`)

### 3. Logpoints

- Click derecho en margen
- Seleccionar "Add Logpoint"
- Agregar mensaje (ej: `User ID: {userId}`)

## 🎯 Debugging de Rutas Específicas

### Ejemplo: Debug del PigController

1. Abrir `src/controllers/pig.controller.ts`
2. Poner breakpoint en el método `findAll`
3. Iniciar debug con "Debug NestJS (ts-node)"
4. Hacer request a `GET http://localhost:3000/pigs`
5. El debugger se pausará en el breakpoint

### Variables Útiles para Inspeccionar:

- `req` - Request object
- `res` - Response object
- `@Body()` - Request body
- `@Param()` - Route parameters
- `@Query()` - Query parameters

## 🐛 Debugging de Servicios y Módulos

### ConfigService

```typescript
// En cualquier servicio
constructor(private configService: ConfigService) {}

someMethod() {
  const dbHost = this.configService.get('DB_HOST'); // <- Breakpoint aquí
  console.log('DB Host:', dbHost);
}
```

### TypeORM (cuando esté habilitado)

```typescript
// En servicios con TypeORM
async findAll() {
  const users = await this.userRepository.find(); // <- Breakpoint aquí
  return users;
}
```

## 🔍 Debugging de Middleware y Guards

### Ejemplo de Custom Middleware

```typescript
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...'); // <- Breakpoint aquí
    next();
  }
}
```

## 📊 Watch Variables y Call Stack

### Panel de Variables:

- **Local**: Variables en el scope actual
- **Global**: Variables globales de Node.js
- **Closure**: Variables del closure parent

### Call Stack:

- Muestra la pila de llamadas actual
- Click en cualquier frame para navegar
- Útil para entender el flujo de ejecución

## ⚡ Atajos de Teclado Útiles

- **F5**: Continuar/Iniciar debugging
- **F10**: Step Over (siguiente línea)
- **F11**: Step Into (entrar en función)
- **Shift+F11**: Step Out (salir de función)
- **Ctrl+Shift+F5**: Restart debugging
- **Shift+F5**: Stop debugging
- **F9**: Toggle breakpoint

## 🔧 Troubleshooting

### Problema: "Cannot find module"

**Solución**: Verificar que tsconfig-paths esté configurado

```json
// tsconfig.json - paths mapping
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"]
    }
  }
}
```

### Problema: Breakpoints no funcionan

**Soluciones**:

1. Verificar que source maps estén habilitados
2. Asegurar que el archivo esté guardado
3. Reiniciar debugging session

### Problema: Variables no se muestran

**Soluciones**:

1. Verificar que estés en el scope correcto
2. Step into la función si es necesaria
3. Verificar que TypeScript está compilando correctamente

## 📚 Recursos Adicionales

- [VS Code Debugging Guide](https://code.visualstudio.com/docs/editor/debugging)
- [Node.js Debugging Guide](https://nodejs.org/en/guides/debugging-getting-started/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [ts-node Documentation](https://typestrong.org/ts-node/)
