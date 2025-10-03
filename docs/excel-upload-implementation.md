# 📊 Funcionalidad de Carga de Archivos Excel - ContPAQ

## 🎯 Funcionalidad Implementada

Se ha implementado completamente la funcionalidad para cargar y procesar archivos Excel (.xlsx, .xls) en el módulo `contpaq-excel` del proyecto NestJS.

## 🔧 Dependencias Instaladas

### Dependencias de Producción

```json
{
  "exceljs": "^4.4.0", // Librería para leer y procesar archivos Excel
  "multer": "^1.4.5-lts.1", // Middleware para manejo de archivos multipart
  "@nestjs/platform-express": "^11.0.1" // Plataforma Express para NestJS
}
```

### Dependencias de Desarrollo

```json
{
  "@types/multer": "^1.4.12" // Tipos de TypeScript para multer
}
```

## 🚀 Endpoint Implementado

### **POST** `/contpaq-excel/upload`

**Descripción:** Carga y procesa archivos Excel de ContPAQ para realizar operaciones masivas en la base de datos.

**Configuración:**

- **Content-Type:** `multipart/form-data`
- **Archivos soportados:** `.xlsx`, `.xls`
- **Validación de MIME types:** Automática
- **Almacenamiento temporal:** `./uploads/` con timestamp
- **Limpieza automática:** El archivo se elimina después del procesamiento

**Parámetros:**

- `file` (required): Archivo Excel a procesar

**Respuestas:**

- **201 Success:**

  ```json
  {
    "message": "¡Archivo Excel procesado correctamente!",
    "filename": "1696271339123-datos-contpaq.xlsx",
    "recordsProcessed": 150,
    "statusCode": 201
  }
  ```

- **400 Bad Request:**

  ```json
  {
    "statusCode": 400,
    "message": "Tipo de archivo inválido. Solo se permiten archivos Excel (.xlsx, .xls)"
  }
  ```

- **500 Internal Server Error:**
  ```json
  {
    "statusCode": 500,
    "message": "Error desconocido al procesar el archivo"
  }
  ```

## 🏗️ Estructura del Código

### **Controller** (`contpaq-excel.controller.ts`)

```typescript
@Post('upload')
@UseInterceptors(
  FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const timestamp = Date.now();
        const originalName = file.originalname;
        return cb(null, `${timestamp}-${originalName}`);
      },
    }),
  }),
)
@ApiConsumes('multipart/form-data')
async uploadExcelFile(@UploadedFile() file: Express.Multer.File)
```

**Características:**

- ✅ Validación de tipos MIME
- ✅ Almacenamiento con timestamp único
- ✅ Manejo completo de errores
- ✅ Documentación Swagger detallada
- ✅ Logging detallado del proceso

### **Service** (`contpaq-excel.service.ts`)

```typescript
async processExcelFile(filePath: string): Promise<{ recordsProcessed: number }>
```

**Funcionalidades:**

- ✅ Lectura de archivos Excel con **ExcelJS**
- ✅ Procesamiento de múltiples hojas
- ✅ Detección automática de encabezados
- ✅ Filtrado de filas vacías
- ✅ Logging detallado por hoja y fila
- ✅ Limpieza automática de archivos temporales
- ✅ Manejo robusto de errores

## 📁 Estructura de Archivos

```
uploads/                           # Directorio para archivos temporales
├── .gitkeep                      # Mantiene el directorio en Git
└── [archivos temporales]         # Se eliminan después del procesamiento

src/contpaq-excel/
├── contpaq-excel.controller.ts   # Endpoint de carga actualizado
├── contpaq-excel.service.ts      # Lógica de procesamiento con ExcelJS
├── contpaq-excel.module.ts       # Módulo NestJS
└── dto/                          # DTOs existentes
```

## 🔒 Seguridad y Validaciones

### **Validaciones Implementadas**

- ✅ **Tipos MIME:** Solo `.xlsx` y `.xls`
- ✅ **Existencia de archivo:** Verificación antes de procesar
- ✅ **Limpieza automática:** Eliminación de archivos temporales
- ✅ **Manejo de errores:** Try-catch completo con cleanup

### **Configuración .gitignore**

```gitignore
# Uploads directory - temporary files
/uploads/*
!/uploads/.gitkeep
```

## 📊 Flujo de Procesamiento

1. **Recepción del archivo** → Multer guarda en `./uploads/`
2. **Validación de tipo** → Verificación de MIME type
3. **Lectura con ExcelJS** → Apertura del workbook
4. **Procesamiento por hoja** → Iteración sobre worksheets
5. **Extracción de datos** → Salto de encabezados, filtrado de vacíos
6. **Logging detallado** → Información de progreso
7. **Limpieza automática** → Eliminación del archivo temporal
8. **Respuesta al cliente** → Información de registros procesados

## 🧪 Cómo Probar

### **1. Via Swagger UI**

1. Ir a `http://localhost:3000/api`
2. Buscar la sección "ContPAQ Excel"
3. Expandir `POST /contpaq-excel/upload`
4. Hacer clic en "Try it out"
5. Seleccionar un archivo Excel
6. Ejecutar la petición

### **2. Via cURL**

```bash
curl -X POST "http://localhost:3000/contpaq-excel/upload" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@ruta/a/tu/archivo.xlsx"
```

### **3. Via Postman**

- Method: POST
- URL: `http://localhost:3000/contpaq-excel/upload`
- Body: form-data
- Key: `file` (type: File)
- Value: Seleccionar archivo Excel

## 📈 Próximos Pasos Sugeridos

1. **Integración con Base de Datos:**
   - Conectar el procesamiento con entidades TypeORM
   - Implementar guardado masivo de registros

2. **Validaciones de Negocio:**
   - Validar estructura específica de archivos ContPAQ
   - Implementar reglas de negocio específicas

3. **Mejoras de Performance:**
   - Procesamiento en chunks para archivos grandes
   - Queue system para procesamiento asíncrono

4. **Funcionalidades Adicionales:**
   - Template de Excel para descarga
   - Historial de archivos procesados
   - Reportes de errores detallados

## ✅ Estado Actual

- ✅ **Dependencias instaladas** sin vulnerabilidades
- ✅ **Endpoint funcionando** correctamente
- ✅ **Swagger documentado** con tema oscuro
- ✅ **Validaciones implementadas** y probadas
- ✅ **Logging detallado** para debugging
- ✅ **Limpieza automática** de archivos temporales

**El sistema está listo para recibir y procesar archivos Excel de ContPAQ!** 🎉
