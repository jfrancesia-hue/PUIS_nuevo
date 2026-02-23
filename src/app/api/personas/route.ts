import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const dni = searchParams.get('dni')
    const q = searchParams.get('q')

    const supabase = await createClient()

    let query = supabase
        .from('personas')
        .select('*')

    if (dni) {
        query = query.eq('dni', dni)
    } else if (q) {
        query = query.or(`nombre.ilike.%${q}%,apellido.ilike.%${q}%`)
    }

    const { data, error } = await query.limit(20)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}

export async function POST(request: Request) {
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
        .from('personas')
        .insert([body])
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}
