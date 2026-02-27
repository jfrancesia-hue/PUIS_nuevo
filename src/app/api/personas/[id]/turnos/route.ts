import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ ok: false, error: 'No autenticado' }, { status: 401 })

    const { data: profile } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('user_id', user.id)
        .single()

    if (!profile) return NextResponse.json({ ok: false, error: 'Perfil no encontrado' }, { status: 404 })

    const { data: items, error } = await supabase
        .from('turnos')
        .select('*')
        .eq('persona_id', id)
        .eq('tenant_id', profile.tenant_id)
        .order('fecha_hora', { ascending: true })

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 })

    return NextResponse.json({ ok: true, items })
}

export async function POST(
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

    // RBAC: Solo admin y profesional pueden crear turnos
    if (profile.rol === 'administrativo') {
        return NextResponse.json({ ok: false, error: 'Permisos insuficientes' }, { status: 403 })
    }

    const body = await request.json()
    const { fecha_hora, nota, profesional, especialidad, org_unit_id } = body

    // 2. Insert
    const { data: turno, error: dbError } = await supabase
        .from('turnos')
        .insert({
            tenant_id: profile.tenant_id,
            persona_id: id,
            fecha_hora,
            nota,
            profesional,
            especialidad,
            org_unit_id,
            estado: 'programado',
            created_by: user.id
        })
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
            persona_id: id,
            accion: 'turno_creado',
            motivo: `Nuevo turno programado para: ${fecha_hora}`,
            metadata: {
                entity: 'turnos',
                entity_id: turno.id,
                fecha_hora,
                profesional,
                especialidad
            }
        })
    } catch (auditErr) {
        console.warn('Audit error:', auditErr)
    }

    return NextResponse.json({ ok: true, item: turno })
}
