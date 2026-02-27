import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: personaId } = await params
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

        // 2. Fetch documents
        const { data: documents, error: dbError } = await supabase
            .from('documentos')
            .select('id, tipo, titulo, mime, size, hash_sha256, created_at')
            .eq('tenant_id', tenant_id)
            .eq('persona_id', personaId)
            .order('created_at', { ascending: false })

        if (dbError) {
            console.error('Error listando documentos:', dbError)
            return NextResponse.json({ ok: false, error: 'Error al listar documentos' }, { status: 500 })
        }

        // 3. Auditoría
        try {
            await supabase.from('audit_events').insert({
                tenant_id,
                user_id: user.id,
                entity_id: personaId,
                action: 'document_list_by_persona',
                motivo: `Consulta de listado de documentos para persona: ${personaId}`,
                metadata: {
                    entity: 'personas',
                    entity_id: personaId,
                    count: documents?.length || 0
                }
            })
        } catch (auditErr) {
            console.warn('Error en auditoría (no crítico):', auditErr)
        }

        return NextResponse.json({
            ok: true,
            items: documents || []
        })

    } catch (error: any) {
        console.error('Error fatal en list endpoint:', error)
        return NextResponse.json({ ok: false, error: 'Error interno del servidor' }, { status: 500 })
    }
}

