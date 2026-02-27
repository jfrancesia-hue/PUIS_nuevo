import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabaseAuth = await createServerClient()

        const { data: { user }, error: authError } = await supabaseAuth.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ ok: false, error: 'No autenticado' }, { status: 401 })
        }

        const { data: profile } = await supabaseAuth
            .from('profiles')
            .select('tenant_id')
            .eq('user_id', user.id)
            .single()

        if (!profile?.tenant_id) {
            return NextResponse.json({ ok: false, error: 'Tenant no encontrado' }, { status: 400 })
        }

        const tenant_id = profile.tenant_id

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        const { data: document, error: dbError } = await supabaseAdmin
            .from('documentos')
            .select('*')
            .eq('id', id)
            .eq('tenant_id', tenant_id)
            .single()

        if (dbError || !document) {
            console.error('Error buscando detalle de documento:', dbError)
            return NextResponse.json({ ok: false, error: 'Documento no encontrado' }, { status: 404 })
        }

        // Auditoría
        try {
            await supabaseAdmin.from('audit_events').insert({
                tenant_id,
                user_id: user.id,
                persona_id: document.persona_id,
                accion: 'document_view_metadata',
                motivo: `Consulta de metadatos: ${document.titulo}`,
                metadata: {
                    entity: 'documentos',
                    entity_id: document.id,
                    tipo: document.tipo
                }
            })
        } catch (auditErr) {
            console.warn('Audit error:', auditErr)
        }

        return NextResponse.json({ ok: true, item: document })

    } catch (error: any) {
        console.error('Error fatal en detail endpoint:', error)
        return NextResponse.json({ ok: false, error: 'Error interno del servidor' }, { status: 500 })
    }
}
