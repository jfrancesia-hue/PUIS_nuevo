# PUIS Catamarca - Sistema Unificado de Salud

Este proyecto es la Plataforma Unificada de Información en Salud (PUIS) para el Ministerio de Salud de Catamarca. Integra una infraestructura real con Supabase para gestión de datos, autenticación y auditoría.

## Requisitos
- Node.js 18+
- Instancia de Supabase (URL y Anon Key)

## Instalación
1. Clonar el repositorio.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar variables de entorno:
   Copia el archivo `.env.example` a `.env.local` y completa los valores:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
   ```

## Configuración de Base de Datos
1. Ejecuta el SQL de la migración inicial ubicada en `supabase/migrations/20240320000000_initial_schema.sql` en el SQL Editor de Supabase.
2. Carga los datos de prueba usando `supabase/seed.sql`.

## Creación de Usuario Admin
Dado que el sistema es multi-tenant y usa RLS, para acceder debes:
1. Crear un usuario en **Supabase Auth** (Email/Password).
2. Insertar un registro en la tabla `profiles` vinculando el `user_id` de Auth con un `tenant_id` y `org_unit_id` válidos (creados en el seed).
   ```sql
   INSERT INTO profiles (user_id, tenant_id, org_unit_id, rol, nombre, email)
   VALUES ('UUID_AUTH_USER', 'ID_DEL_TENANT', 'ID_DE_LA_UNIDAD', 'admin', 'Nombre del Admin', 'email@catamarca.gov.ar');
   ```

## Ejecución
```bash
npm run dev
```
Accede a `http://localhost:3000`.

## Funcionalidades Implementadas
- **Autenticación real**: Integrada con Supabase Auth y Middleware de Next.js.
- **Búsqueda Dinámica**: Filtra personas en tiempo real desde la base de datos local.
- **Ficha Unificada**: Visualización de historial clínico real (turnos, reclamos) con **Auditoría Obligatoria** (RLS + Registro de acceso con motivo).
- **Multi-tenancy**: Aislamiento total de datos por institución vía RLS.
