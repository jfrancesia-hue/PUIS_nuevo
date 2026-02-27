import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: Request) {
    try {
        const supabase = await createClient()

        // 1. Auth & Profile resolution
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ ok: false, error: 'No autenticado' }, { status: 401 })
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('tenant_id')
            .eq('user_id', user.id)
            .single()

        if (!profile?.tenant_id) {
            return NextResponse.json({ ok: false, error: 'Tenant no encontrado' }, { status: 400 })
        }

        const tenant_id = profile.tenant_id

        // 2. Fetch all turnos for the tenant
        const { data: turnos, error: dbError } = await supabase
            .from('turnos')
            .select(`
                *,
                personas:persona_id (
                    nombre,
                    apellido,
                    dni
                )
            `)
            .eq('tenant_id', tenant_id)
            .order('fecha_hora', { ascending: true })

        if (dbError) {
            console.error('Error fetching turnos:', dbError)
            return NextResponse.json({ ok: false, error: 'Error al obtener turnos' }, { status: 500 })
        }

        return NextResponse.json({
            ok: true,
            items: turnos || []
        })

    } catch (error: any) {
        console.error('Fatal error in turnos API:', error)
        return NextResponse.json({ ok: false, error: 'Error interno del servidor' }, { status: 500 })
    }
}
