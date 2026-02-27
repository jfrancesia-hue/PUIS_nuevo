import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const supabaseAuth = await createServerClient()

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ ok: false, error: 'No autenticado' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabaseAuth
      .from('profiles')
      .select('tenant_id, rol')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile?.tenant_id) {
      return NextResponse.json({ ok: false, error: 'Perfil o Tenant no encontrado' }, { status: 400 })
    }

    const { tenant_id, rol } = profile

    if (rol === 'administrativo') {
      return NextResponse.json({ ok: false, error: 'Permisos insuficientes' }, { status: 403 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const persona_id = formData.get('persona_id') as string | null
    const tipo = formData.get('tipo') as string | null
    const titulo = formData.get('titulo') as string | null

    if (!file || !persona_id || !tipo || !titulo) {
      return NextResponse.json({ ok: false, error: 'Faltan campos requeridos' }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const fileExt = file.name.split('.').pop() || 'bin'
    const fileName = `${crypto.randomUUID()}.${fileExt}`
    const storagePath = `${tenant_id}/personas/${persona_id}/${fileName}`

    const fileBuffer = await file.arrayBuffer()
    const hash_sha256 = crypto.createHash('sha256').update(Buffer.from(fileBuffer)).digest('hex')

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('documentos')
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Error subiendo archivo:', uploadError)
      return NextResponse.json({ ok: false, error: 'Error al subir archivo a Storage' }, { status: 500 })
    }

    const { data: docData, error: dbError } = await supabaseAdmin
      .from('documentos')
      .insert({
        tenant_id,
        persona_id,
        tipo,
        titulo,
        storage_path: storagePath,
        mime: file.type,
        size: file.size,
        created_by: user.id,
        hash_sha256: hash_sha256
      })
      .select('id, persona_id, titulo, tipo, mime, size, hash_sha256')
      .single()

    if (dbError) {
      console.error('Error guardando metadata:', dbError)
      return NextResponse.json({ ok: false, error: 'Error al persistir metadata' }, { status: 500 })
    }

    // Auditoría
    try {
      await supabaseAdmin.from('audit_events').insert({
        tenant_id,
        user_id: user.id,
        entity_id: docData.id,
        action: 'document_uploaded',
        motivo: `Upload de documento: ${titulo}`,
        metadata: {
          entity: 'documentos',
          entity_id: docData.id,
          persona_id,
          tipo,
          titulo,
          storage_path: storagePath
        }
      })
    } catch (auditErr) {
      console.warn('Audit error:', auditErr)
    }

    return NextResponse.json({ ok: true, item: docData })

  } catch (error: any) {
    console.error('Error fatal en upload endpoint:', error)
    return NextResponse.json({ ok: false, error: 'Error interno del servidor' }, { status: 500 })
  }
}
