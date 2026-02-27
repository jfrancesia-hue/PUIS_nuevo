import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  )

  // auth
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return NextResponse.json({ ok: false, error: 'No autenticado' }, { status: 401 })
  }

  // tenant del usuario
  const { data: profile, error: pErr } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('user_id', userData.user.id)
    .single()

  if (pErr) return NextResponse.json({ ok: false, error: pErr.message }, { status: 400 })

  const tenant_id = profile.tenant_id as string

  // crear 1 persona demo (ajustá campos si tu tabla tiene otros nombres obligatorios)
  const payload: any = {
    tenant_id,
    dni: '20123456',
    nombre: 'Juan',
    apellido: 'Perez',
  }

  const { data, error } = await supabase
    .from('personas')
    .insert(payload)
    .select('id, dni, nombre, apellido')
    .single()

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 })

  return NextResponse.json({ ok: true, persona: data })
}