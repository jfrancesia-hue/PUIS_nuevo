import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const body = await req.json()
  const motivo = String(body.motivo ?? '').trim()
  const entity_id = body.entity_id || body.persona_id || null
  const accion = String(body.accion || body.action || 'ver_ficha').trim()
  const entity = String(body.entity || 'personas').trim()

  if (!motivo) {
    return NextResponse.json({ ok: false, error: 'Motivo obligatorio' }, { status: 400 })
  }

  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return NextResponse.json({ ok: false, error: 'No autenticado' }, { status: 401 })

  const { data: profile, error: pErr } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('user_id', userData.user.id)
    .single()

  if (pErr) return NextResponse.json({ ok: false, error: pErr.message }, { status: 400 })

  const { error } = await supabase.from('audit_events').insert({
    tenant_id: profile.tenant_id,
    user_id: userData.user.id,
    entity_id,
    action: accion,
    entity,
    motivo,
    metadata: {
      ...body.metadata
    }
  })

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}