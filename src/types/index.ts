export type Rol = 'admin' | 'profesional' | 'administrativo';

export interface Profile {
    id: string;
    user_id: string;
    tenant_id: string;
    rol: Rol;
    nombre?: string;
    apellido?: string;
    created_at: string;
}

export interface Persona {
    id: string;
    tenant_id: string;
    nombre: string;
    apellido: string;
    dni: string;
    fecha_nacimiento?: string;
    sexo?: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    obra_social?: string;
    turnos?: any[];
    reclamos?: any[];
    created_at: string;
}

export interface Tarea {
    id: string;
    tenant_id: string;
    persona_id: string | null;
    tipo: string;
    titulo: string;
    descripcion: string | null;
    estado: 'pendiente' | 'en_proceso' | 'completada' | 'cancelada';
    prioridad: 'baja' | 'media' | 'alta';
    created_by: string;
    created_at: string;
    personas?: Persona;
}

export interface Turno {
    id: string;
    tenant_id: string;
    persona_id: string;
    profesional: string | null;
    especialidad: string | null;
    fecha_hora: string;
    estado: 'programado' | 'realizado' | 'cancelado' | 'ausente';
    nota: string | null;
    org_unit_id: string | null;
    created_by: string;
    created_at: string;
}

export interface Documento {
    id: string;
    tenant_id: string;
    persona_id: string;
    tipo: string;
    titulo: string;
    storage_path: string;
    mime: string;
    size: number;
    hash_sha256?: string;
    created_at: string;
}
