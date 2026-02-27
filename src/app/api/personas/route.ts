import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  const supabase = await createClient()

  const url = new URL(req.url)
  const q = (url.searchParams.get('q') || '').trim()

  if (!q) {
    return NextResponse.json({ ok: true, items: [] })
  }

  const { data: userData, error: userErr } = await supabase.auth.getUser()
  if (userErr || !userData.user) return NextResponse.json({ ok: false, error: 'No autenticado' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('user_id', userData.user.id)
    .single()

  if (!profile) return NextResponse.json({ ok: false, error: 'Perfil no encontrado' }, { status: 404 })

  const { data, error } = await supabase
    .from('personas')
    .select('id, dni, nombre, apellido, created_at')
    .eq('tenant_id', profile.tenant_id)
    .or(`dni.ilike.%${q}%,nombre.ilike.%${q}%,apellido.ilike.%${q}%`)
    .limit(25)

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 })

  return NextResponse.json({ ok: true, items: data ?? [] })
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const body = await req.json()

  const { data: userData, error: userErr } = await supabase.auth.getUser()
  if (userErr || !userData.user) return NextResponse.json({ ok: false, error: 'No autenticado' }, { status: 401 })

  const { data: profile, error: pErr } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('user_id', userData.user.id)
    .single()

  if (pErr) return NextResponse.json({ ok: false, error: pErr.message }, { status: 400 })

  const payload = {
    tenant_id: profile.tenant_id,
    dni: String(body.dni ?? '').trim(),
    nombre: String(body.nombre ?? '').trim(),
    apellido: String(body.apellido ?? '').trim(),
    email: body.email,
    telefono: body.telefono,
    fecha_nacimiento: body.fecha_nacimiento,
    sexo: body.sexo,
    direccion: body.direccion,
    obra_social: body.obra_social
  }

  const { data, error } = await supabase.from('personas').insert(payload).select().single()
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 })

  // Auditoría
  try {
    await supabase.from('audit_events').insert({
      tenant_id: profile.tenant_id,
      user_id: userData.user.id,
      entity_id: data.id,
      action: 'persona_creada',
      motivo: `Alta de persona: ${data.nombre} ${data.apellido}`,
      metadata: { entity: 'personas', entity_id: data.id, dni: data.dni }
    })
  } catch (e) {
    console.warn('Audit error:', e)
  }

  return NextResponse.json({ ok: true, item: data })
}
