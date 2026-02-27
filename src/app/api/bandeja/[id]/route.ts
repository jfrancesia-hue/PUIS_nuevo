import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
    req: Request,
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

    const { estado, prioridad, descripcion } = await req.json()

    const { data: item, error } = await supabase
        .from('tareas')
        .update({ estado, prioridad, descripcion })
        .eq('id', id)
        .eq('tenant_id', profile.tenant_id)
        .select()
        .single()

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 })

    // Auditoría
    try {
        await supabase.from('audit_events').insert({
            tenant_id: profile.tenant_id,
            user_id: user.id,
            accion: 'tarea_actualizada',
            motivo: `Actualización de tarea ID: ${id} `,
            metadata: {
                entity: 'tareas',
                entity_id: id,
                estado,
                prioridad
            }
        })
    } catch (e) {
        console.warn('Audit error:', e)
    }

    return NextResponse.json({ ok: true, item })
}
