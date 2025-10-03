-- Script de inicialización de base de datos PostgreSQL
-- Para Pig Administration Accounting System

-- Crear la base de datos de desarrollo (ejecutar como superusuario)
-- CREATE DATABASE pig_administration_accounting_dev;

-- Crear la base de datos de producción (ejecutar como superusuario)
-- CREATE DATABASE pig_administration_accounting_prod;

-- Crear usuario específico para la aplicación (opcional)
-- CREATE USER pig_admin WITH PASSWORD 'your_secure_password';
-- GRANT ALL PRIVILEGES ON DATABASE pig_administration_accounting_dev TO pig_admin;
-- GRANT ALL PRIVILEGES ON DATABASE pig_administration_accounting_prod TO pig_admin;

-- Extensiones útiles para PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Función para actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';