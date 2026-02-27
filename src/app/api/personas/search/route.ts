import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
    const supabase = await createClient()

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return NextResponse.json({ ok: false, error: 'No autenticado' }, { status: 401 })

    const { data: profile } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('user_id', userData.user.id)
        .single()

    if (!profile) return NextResponse.json({ ok: false, error: 'Perfil no encontrado' }, { status: 400 })

    const url = new URL(req.url)
    const q = (url.searchParams.get('q') || '').trim()

    if (!q) {
        return NextResponse.json({ ok: true, items: [] })
    }

    let queryBuilder = supabase
        .from('personas')
        .select('id, dni, nombre, apellido, fecha_nacimiento, sexo')
        .eq('tenant_id', profile.tenant_id)

    const isNumeric = /^\d+$/.test(q)

    if (isNumeric) {
        queryBuilder = queryBuilder.ilike('dni', `${q}%`)
    } else {
        queryBuilder = queryBuilder.or(`nombre.ilike.%${q}%,apellido.ilike.%${q}%`)
    }

    const { data, error } = await queryBuilder
        .order('apellido', { ascending: true })
        .limit(20)

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 })

    return NextResponse.json({ ok: true, items: data ?? [] })
}
