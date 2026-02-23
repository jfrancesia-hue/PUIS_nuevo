import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient()
    const id = params.id

    const { data: persona, error: personaError } = await supabase
        .from('personas')
        .select(`
      *,
      turnos (*),
      reclamos (*),
      derivaciones:derivaciones!persona_id (*),
      documentos (*)
    `)
        .eq('id', id)
        .single()

    if (personaError) {
        return NextResponse.json({ error: personaError.message }, { status: 500 })
    }

    return NextResponse.json(persona)
}
