-- Migración: Ajustar esquema de turnos para Phase 4 (MVP)
-- 1. Renombrar columnas para consistencia con el requerimiento
ALTER TABLE turnos RENAME COLUMN fecha TO fecha_hora;
ALTER TABLE turnos RENAME COLUMN notas TO nota;

-- 2. Asegurar columna created_by (no nula para registros nuevos)
ALTER TABLE turnos ADD COLUMN created_by UUID REFERENCES auth.users(id);

-- 3. Ajustar el constraint de estados (si ya existe uno, lo borramos y recreamos)
ALTER TABLE turnos DROP CONSTRAINT IF EXISTS turnos_estado_check;
ALTER TABLE turnos ADD CONSTRAINT turnos_estado_check CHECK (estado IN ('programado', 'atendido', 'cancelado', 'pendiente', 'confirmado'));
-- Nota: Dejamos pendiente/confirmado por compatibilidad con datos existentes, pero usaremos programado/atendido/cancelado para el MVP.

-- 4. Hacer org_unit_id y profesional opcionales para simplificar la demo ministerial
ALTER TABLE turnos ALTER COLUMN org_unit_id DROP NOT NULL;
ALTER TABLE turnos ALTER COLUMN profesional DROP NOT NULL;

-- 5. Actualizar índices si es necesario (ya existe idx_turnos_tenant_persona_fecha, lo actualizamos si queremos precisión)
-- DROP INDEX IF EXISTS idx_turnos_tenant_persona_fecha;
-- CREATE INDEX idx_turnos_tenant_persona_fecha_hora ON turnos(tenant_id, persona_id, fecha_hora);
