-- Migración Inicial: Esquema PUIS Catamarca
-- Multi-tenant, RLS, Auditoría y Storage

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLAS BASE
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE org_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) NOT NULL,
    nombre TEXT NOT NULL,
    tipo TEXT NOT NULL, -- hospital, centro, area
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id),
    tenant_id UUID REFERENCES tenants(id) NOT NULL,
    org_unit_id UUID REFERENCES org_units(id),
    rol TEXT NOT NULL CHECK (rol IN ('admin', 'operador', 'auditor', 'medico')),
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE personas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) NOT NULL,
    dni TEXT NOT NULL,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    fecha_nac DATE NOT NULL,
    sexo TEXT,
    telefono TEXT,
    domicilio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, dni)
);

CREATE TABLE turnos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) NOT NULL,
    persona_id UUID REFERENCES personas(id) NOT NULL,
    org_unit_id UUID REFERENCES org_units(id) NOT NULL,
    fecha TIMESTAMP NOT NULL,
    especialidad TEXT NOT NULL,
    profesional TEXT NOT NULL,
    estado TEXT NOT NULL CHECK (estado IN ('pendiente', 'confirmado', 'cancelado', 'atendido')),
    notas TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reclamos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) NOT NULL,
    persona_id UUID REFERENCES personas(id) NOT NULL,
    org_unit_id UUID REFERENCES org_units(id) NOT NULL,
    categoria TEXT NOT NULL,
    descripcion TEXT,
    urgencia TEXT NOT NULL CHECK (urgencia IN ('baja', 'media', 'alta')),
    estado TEXT NOT NULL CHECK (estado IN ('abierto', 'en_proceso', 'resuelto', 'cerrado')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE derivaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) NOT NULL,
    persona_id UUID REFERENCES personas(id) NOT NULL,
    desde_org_unit_id UUID REFERENCES org_units(id) NOT NULL,
    hacia_org_unit_id UUID REFERENCES org_units(id) NOT NULL,
    motivo TEXT NOT NULL,
    prioridad TEXT NOT NULL CHECK (prioridad IN ('normal', 'urgente')),
    estado TEXT NOT NULL CHECK (estado IN ('enviada', 'recibida', 'aceptada', 'rechazada', 'cerrada')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE documentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) NOT NULL,
    persona_id UUID REFERENCES personas(id) NOT NULL,
    tipo TEXT NOT NULL,
    titulo TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    hash_sha256 TEXT NOT NULL,
    mime TEXT,
    size INTEGER,
    created_by UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id UUID,
    motivo TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE whatsapp_threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) NOT NULL,
    persona_id UUID REFERENCES personas(id),
    telefono TEXT NOT NULL,
    estado TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) NOT NULL,
    thread_id UUID REFERENCES whatsapp_threads(id) NOT NULL,
    direction TEXT NOT NULL CHECK (direction IN ('in', 'out')),
    body TEXT NOT NULL,
    raw JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ai_classifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) NOT NULL,
    source TEXT NOT NULL, -- whatsapp, reclamo, etc.
    source_id UUID NOT NULL,
    categoria TEXT,
    urgencia TEXT,
    confidence NUMERIC,
    model TEXT,
    raw JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ÍNDICES
CREATE INDEX idx_personas_tenant_dni ON personas(tenant_id, dni);
CREATE INDEX idx_turnos_tenant_persona_fecha ON turnos(tenant_id, persona_id, fecha);
CREATE INDEX idx_reclamos_tenant_persona_created ON reclamos(tenant_id, persona_id, created_at);
CREATE INDEX idx_audit_events_tenant_created ON audit_events(tenant_id, created_at);
CREATE INDEX idx_documentos_tenant_persona_created ON documentos(tenant_id, persona_id, created_at);

-- 4. RLS HELPER FUNCTION
CREATE OR REPLACE FUNCTION current_tenant_id()
RETURNS UUID AS $$
    SELECT tenant_id FROM profiles WHERE user_id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 5. ACTIVAR RLS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE turnos ENABLE ROW LEVEL SECURITY;
ALTER TABLE reclamos ENABLE ROW LEVEL SECURITY;
ALTER TABLE derivaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_classifications ENABLE ROW LEVEL SECURITY;

-- 6. POLICIES (Multi-tenant isolation)

-- Policy Template: User can only see rows belonging to their tenant
-- EXCEPT tenants table itself (needs special handling for onboarding/admin)

-- Tenants Policy: Admins can see their own tenant
CREATE POLICY tenant_isolation_policy ON tenants
USING (id = current_tenant_id());

-- Global isolation for other tables
-- Profiles
CREATE POLICY profile_isolation_policy ON profiles
USING (tenant_id = (SELECT tenant_id FROM profiles WHERE user_id = auth.uid()));

-- Multi-tenant macro policies
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name NOT IN ('tenants', 'profiles')
    LOOP
        EXECUTE format('CREATE POLICY %I_isolation_policy ON %I USING (tenant_id = current_tenant_id())', t, t);
    END LOOP;
END $$;

-- 7. STORAGE
-- Notar: Esto se hace usualmente desde la UI o script, pero aquí definimos la política lógica:
-- Bucket 'documentos'
-- Policy: SELECT/INSERT IF (storage.foldername(name))[1] = current_tenant_id()::text
