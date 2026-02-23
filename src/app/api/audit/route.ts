import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const supabase = await createClient()
    const body = await request.json()

    const { action, entity, entity_id, motivo, metadata } = body

    if (!motivo) {
        return NextResponse.json({ error: 'Motivo de acceso obligatorio' }, { status: 400 })
    }

    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
        .from('audit_events')
        .insert([{
            user_id: user?.id,
            action,
            entity,
            entity_id,
            motivo,
            metadata: metadata || {}
        }])
        .select()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}
