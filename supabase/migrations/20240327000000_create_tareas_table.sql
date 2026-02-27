-- Migración: Crear tabla de tareas para Bandeja Central (Phase 5)

CREATE TABLE IF NOT EXISTS public.tareas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) NOT NULL,
    persona_id UUID REFERENCES public.personas(id) NULL,
    tipo TEXT NOT NULL, -- 'consulta', 'derivacion', 'reclamo', 'documentacion'
    titulo TEXT NOT NULL,
    descripcion TEXT NULL,
    estado TEXT NOT NULL DEFAULT 'pendiente', -- 'pendiente', 'en_proceso', 'resuelto', 'cancelado'
    prioridad TEXT NOT NULL DEFAULT 'media', -- 'baja', 'media', 'alta'
    created_by UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.tareas ENABLE ROW LEVEL SECURITY;

-- Política de aislamiento por tenant (reutilizando el patrón existente)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'tareas' AND policyname = 'tareas_isolation_policy'
    ) THEN
        CREATE POLICY tareas_isolation_policy ON public.tareas 
        USING (tenant_id = (SELECT tenant_id FROM profiles WHERE user_id = auth.uid()));
    END IF;
END $$;

-- Índice para optimizar consultas de la bandeja
CREATE INDEX IF NOT EXISTS idx_tareas_tenant_estado_prioridad ON public.tareas(tenant_id, estado, prioridad DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tareas_persona ON public.tareas(persona_id);

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tareas_updated_at
    BEFORE UPDATE ON tareas
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
