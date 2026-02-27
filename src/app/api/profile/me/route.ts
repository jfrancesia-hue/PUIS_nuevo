import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ ok: false, error: 'No autenticado' }, { status: 401 })
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('user_id, tenant_id, rol, nombre, email, activo')
      .eq('user_id', user.id)
      .single()

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true, item: profile })
  } catch (error: any) {
    console.error('Fatal error in profile/me API:', error)
    return NextResponse.json({ ok: false, error: 'Error interno' }, { status: 500 })
  }
}
