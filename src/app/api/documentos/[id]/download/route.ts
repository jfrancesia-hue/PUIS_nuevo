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

    const { data: { user } } = await supabaseAuth.auth.getUser()
    if (!user) {
      return NextResponse.json({ ok: false, error: 'No autenticado' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabaseAuth
      .from('profiles')
      .select('tenant_id, rol')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ ok: false, error: 'Perfil no encontrado' }, { status: 404 })
    }

    if (profile.rol === 'administrativo') {
      return NextResponse.json({ ok: false, error: 'Permisos insuficientes' }, { status: 403 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: document, error: dbError } = await supabaseAdmin
      .from('documentos')
      .select('id, titulo, mime, storage_path, tenant_id, persona_id')
      .eq('id', id)
      .eq('tenant_id', profile.tenant_id)
      .single()

    if (dbError || !document) {
      return NextResponse.json({ ok: false, error: 'Documento no encontrado' }, { status: 404 })
    }

    const { data: signData, error: signError } = await supabaseAdmin.storage
      .from('documentos')
      .createSignedUrl(document.storage_path, 300)

    if (signError || !signData?.signedUrl) {
      return NextResponse.json({ ok: false, error: 'No se pudo generar el enlace' }, { status: 500 })
    }

    // Auditoría
    try {
      await supabaseAdmin.from('audit_events').insert({
        tenant_id: document.tenant_id,
        user_id: user.id,
        entity_id: document.id,
        action: 'document_download_signed_url',
        motivo: `Descarga de documento: ${document.titulo}`,
        metadata: {
          entity: 'documentos',
          entity_id: document.id,
          persona_id: document.persona_id,
          storage_path: document.storage_path
        }
      })
    } catch (auditErr) {
      console.warn('Audit error:', auditErr)
    }

    return NextResponse.json({
      ok: true,
      item: {
        id: document.id,
        titulo: document.titulo,
        mime: document.mime,
        signedUrl: signData.signedUrl
      }
    })
  } catch (error: any) {
    console.error('Error fatal en download endpoint:', error)
    return NextResponse.json({ ok: false, error: 'Error interno del servidor' }, { status: 500 })
  }
}
