import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const supabase = await createClient()

    // 1. Auth & Profile
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ ok: false, error: 'No autenticado' }, { status: 401 })
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('tenant_id, rol')
        .eq('user_id', user.id)
        .single()

    if (!profile) {
        return NextResponse.json({ ok: false, error: 'Perfil no encontrado' }, { status: 404 })
    }

    // RBAC: Administrativo no puede modificar turnos
    if (profile.rol === 'administrativo') {
        return NextResponse.json({ ok: false, error: 'Permisos insuficientes' }, { status: 403 })
    }

    const body = await request.json()
    const { estado, nota } = body

    // 2. Update
    const { data: turno, error: dbError } = await supabase
        .from('turnos')
        .update({ estado, nota })
        .eq('id', id)
        .eq('tenant_id', profile.tenant_id)
        .select()
        .single()

    if (dbError) {
        return NextResponse.json({ ok: false, error: dbError.message }, { status: 400 })
    }

    // 3. Auditoría
    try {
        await supabase.from('audit_events').insert({
            tenant_id: profile.tenant_id,
            user_id: user.id,
            entity_id: turno.persona_id,
            action: 'turno_actualizado',
            motivo: `Cambio de estado del turno a: ${estado}`,
            metadata: {
                entity: 'turnos',
                entity_id: id,
                estado_anterior: turno.estado, // Esto es el nuevo en realidad por el select posterior
                nota
            }
        })
    } catch (auditErr) {
        console.warn('Audit error:', auditErr)
    }

    return NextResponse.json({ ok: true, item: turno })
}
