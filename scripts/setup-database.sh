#!/bin/bash

# Script para configurar la base de datos PostgreSQL
# Ejecutar este script después de tener PostgreSQL instalado y corriendo

echo "🐷 Configurando base de datos para Pig Administration Accounting"
echo "=================================================="

# Configurar variables
DB_NAME="pig_administration_accounting_dev"
DB_USER="postgres"
DB_HOST="localhost"
DB_PORT="5432"

echo "📋 Creando base de datos: $DB_NAME"

# Crear la base de datos
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -c "CREATE DATABASE $DB_NAME;"

if [ $? -eq 0 ]; then
    echo "✅ Base de datos creada exitosamente"
    
    echo "🔧 Ejecutando script de inicialización..."
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f database/init.sql
    
    if [ $? -eq 0 ]; then
        echo "✅ Script de inicialización ejecutado exitosamente"
        echo ""
        echo "🎉 ¡Base de datos configurada correctamente!"
        echo "   Puedes ahora descomentar la configuración en src/database/database.module.ts"
        echo "   y reiniciar la aplicación para conectarse a la base de datos."
    else
        echo "❌ Error ejecutando el script de inicialización"
    fi
else
    echo "❌ Error creando la base de datos (puede que ya exista)"
fi

echo ""
echo "🚀 Para iniciar la aplicación:"
echo "   npm run start:dev"
echo ""
echo "📚 Para ver la documentación Swagger:"
echo "   http://localhost:3000/api"