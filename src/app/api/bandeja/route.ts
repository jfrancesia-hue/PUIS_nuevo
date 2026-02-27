import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ ok: false, error: 'No autenticado' }, { status: 401 })

    // 1. Obtener perfil
    const { data: profile } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('user_id', user.id)
        .single()

    if (!profile) return NextResponse.json({ ok: false, error: 'Perfil no encontrado' }, { status: 404 })

    // 2. Parámetros de filtro
    const { searchParams } = new URL(req.url)
    const estado = searchParams.get('estado')

    let query = supabase
        .from('tareas')
        .select(`
      *,
      personas (id, nombre, apellido, dni)
    `)
        .eq('tenant_id', profile.tenant_id)
        .order('created_at', { ascending: false })

    if (estado && estado !== 'todos') {
        query = query.eq('estado', estado)
    }

    const { data: items, error } = await query

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 })

    return NextResponse.json({ ok: true, items })
}

export async function POST(req: Request) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ ok: false, error: 'No autenticado' }, { status: 401 })

    const { data: profile } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('user_id', user.id)
        .single()

    if (!profile) return NextResponse.json({ ok: false, error: 'Perfil no encontrado' }, { status: 404 })

    // 2. Procesar Body
    const { persona_id, tipo, titulo, descripcion, prioridad } = await req.json()
    if (!tipo || !titulo) {
        return NextResponse.json({ ok: false, error: 'Faltan campos (tipo, titulo)' }, { status: 400 })
    }

    // 3. Insertar Tarea
    const { data: tarea, error: insertError } = await supabase
        .from('tareas')
        .insert({
            tenant_id: profile.tenant_id,
            persona_id: persona_id || null,
            tipo,
            titulo,
            descripcion,
            prioridad: prioridad || 'media',
            estado: 'pendiente',
            created_by: user.id
        })
        .select()
        .single()

    if (insertError) return NextResponse.json({ ok: false, error: insertError.message }, { status: 400 })

    // 4. Auditoría
    try {
        await supabase.from('audit_events').insert({
            tenant_id: profile.tenant_id,
            user_id: user.id,
            entity_id: tarea.id,
            action: 'tarea_creada',
            entity: 'tareas',
            motivo: `Creación de tarea: ${titulo}`,
            metadata: {
                tipo,
                prioridad
            }
        })
    } catch (e) {
        console.warn('Audit error:', e)
    }

    return NextResponse.json({ ok: true, item: tarea })
}
