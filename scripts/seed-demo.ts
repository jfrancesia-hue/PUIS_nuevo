import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { createHash, randomUUID } from 'crypto'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Debe ser proveidda por el usuario en .env.local

if (!supabaseUrl || !serviceRoleKey) {
    console.error('ERROR: Faltan variables de entorno NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

const PERSONAS_SEED = [
    { dni: '20123456', nombre: 'Roberto', apellido: 'Gomez', fecha_nac: '1975-03-12', sexo: 'Masculino', telefono: '3834111222', domicilio: 'Av. Virgen del Valle 450' },
    { dni: '30111222', nombre: 'Marta', apellido: 'Sosa', fecha_nac: '1985-06-25', sexo: 'Femenino', telefono: '3834222333', domicilio: 'Calle Republica 123' },
    { dni: '27123456', nombre: 'Carlos', apellido: 'Rodriguez', fecha_nac: '1978-09-10', sexo: 'Masculino', telefono: '3834333444', domicilio: 'Barrio Los Ceibos M-C' },
    { dni: '35999888', nombre: 'Lucia', apellido: 'Fernandez', fecha_nac: '1992-01-15', sexo: 'Femenino', telefono: '3834444555', domicilio: 'Pje. San Francisco 789' },
    { dni: '18777666', nombre: 'Jorge', apellido: 'Lopez', fecha_nac: '1968-11-20', sexo: 'Masculino', telefono: '3834555666', domicilio: 'Av. Belgrano 1001' },
    { dni: '40111000', nombre: 'Sofia', apellido: 'Martinez', fecha_nac: '2000-05-05', sexo: 'Femenino', telefono: '3834666777', domicilio: 'Calle Rivadavia 200' },
    { dni: '22333444', nombre: 'Miguel', apellido: 'Sanchez', fecha_nac: '1972-04-18', sexo: 'Masculino', telefono: '3834777888', domicilio: 'Av. Acosta Villafañe 500' },
    { dni: '33444555', nombre: 'Elena', apellido: 'Diaz', fecha_nac: '1988-08-30', sexo: 'Femenino', telefono: '3834888999', domicilio: 'Calle Maipu 678' },
    { dni: '15666777', nombre: 'Pedro', apellido: 'Alvarez', fecha_nac: '1962-12-01', sexo: 'Masculino', telefono: '3834999000', domicilio: 'Valle Viejo - Centro' },
    { dni: '29888777', nombre: 'Laura', apellido: 'Torres', fecha_nac: '1983-07-22', sexo: 'Femenino', telefono: '3834000111', domicilio: 'FME - Piedra Blanca' },
]

const ASSETS = [
    { file: 'ejemplo1.pdf', titulo: 'Analisis Clinico Feb 2024', tipo: 'laboratorio' },
    { file: 'ejemplo2.pdf', titulo: 'Historia Clinica Digitalizada', tipo: 'historia_clinica' },
    { file: 'ejemplo3.jpg', titulo: 'Imagen Radiologia', tipo: 'estudio_imagen' },
]

async function seed() {
    console.log('--- Iniciando Seed de Demo ---')

    // 1. Obtener primer tenant disponible
    const { data: tenants, error: tErr } = await supabase.from('tenants').select('id').limit(1)
    if (tErr || !tenants?.length) {
        console.error('ERROR: No se encontró ningún tenant en la DB. Asegúrese de haber corrido las migraciones/seed.sql base.')
        return
    }
    const tenant_id = tenants[0].id
    console.log(`> Usando tenant_id: ${tenant_id}`)

    // 2. Insertar Personas
    console.log('> Insertando personas...')
    const insertedPersonas = []
    for (const p of PERSONAS_SEED) {
        const { data, error } = await supabase
            .from('personas')
            .upsert({ ...p, tenant_id }, { onConflict: 'dni' })
            .select('id, dni')
            .single()

        if (error) {
            console.warn(`! Error al insertar/actualizar persona ${p.dni}: ${error.message}`)
        } else {
            insertedPersonas.push(data)
        }
    }
    console.log(`> ${insertedPersonas.length} personas procesadas.`)

    // 3. Subir Documentos para las primeras 3 personas
    console.log('> Procesando documentos y storage...')
    const bucketName = 'documentos'

    for (let i = 0; i < Math.min(3, insertedPersonas.length); i++) {
        const persona = insertedPersonas[i]
        console.log(`  - Subiendo documentos para: ${persona.dni}`)

        for (const asset of ASSETS) {
            const filePath = path.join('seed_assets', asset.file)
            if (!fs.existsSync(filePath)) {
                console.warn(`    ! Archivo no encontrado: ${filePath}. Saltando.`)
                continue
            }

            const fileBuffer = fs.readFileSync(filePath)
            const fileExt = path.extname(asset.file)
            const fileName = `${randomUUID()}${fileExt}`
            const storagePath = `${tenant_id}/personas/${persona.id}/${fileName}`

            // Calcular Hash
            const hash = createHash('sha256').update(fileBuffer).digest('hex')

            // Subir a Storage
            const { error: uploadErr } = await supabase.storage
                .from(bucketName)
                .upload(storagePath, fileBuffer, {
                    contentType: asset.file.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
                    upsert: true
                })

            if (uploadErr) {
                console.warn(`    ! Error al subir ${asset.file} a storage: ${uploadErr.message}`)
                continue
            }

            // Insertar Metadatos
            const { error: dbErr } = await supabase.from('documentos').insert({
                tenant_id,
                persona_id: persona.id,
                titulo: asset.titulo,
                tipo: asset.tipo,
                storage_path: storagePath,
                mime: asset.file.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
                size: fileBuffer.length,
                hash_sha256: hash,
                created_by: '00000000-0000-0000-0000-000000000000' // Placeholder para sistema/seed
            })

            if (dbErr) {
                console.warn(`    ! Error al insertar metadatos de ${asset.file} en DB: ${dbErr.message}`)
            } else {
                console.log(`    + Documento ${asset.file} cargado con éxito.`)
            }
        }
    }

    // 4. Insertar Turnos para un par de personas
    console.log('> Insertando turnos de prueba...')
    const TURNOS_EJEMPLO = [
        { especialidad: 'Cardiología', estado: 'atendido', nota: 'Control rutinario satisfactorio', dias_offset: -10 },
        { especialidad: 'Clínica Médica', estado: 'programado', nota: 'Chequeo anual', dias_offset: 5 },
        { especialidad: 'Odontología', estado: 'programado', nota: 'Limpieza semestral', dias_offset: 15 },
    ]

    for (let i = 0; i < Math.min(2, insertedPersonas.length); i++) {
        const persona = insertedPersonas[i]
        for (const t of TURNOS_EJEMPLO) {
            const fecha = new Date()
            fecha.setDate(fecha.getDate() + t.dias_offset)

            const { error: turnErr } = await supabase.from('turnos').insert({
                tenant_id,
                persona_id: persona.id,
                especialidad: t.especialidad,
                estado: t.estado,
                nota: t.nota,
                fecha_hora: fecha.toISOString(),
                created_by: '00000000-0000-0000-0000-000000000000'
            })
            if (turnErr) console.warn(`    ! Error al insertar turno para ${persona.dni}: ${turnErr.message}`)
        }
    }
    console.log(`> Turnos de prueba generados.`)

    // 5. Insertar Tareas (Bandeja Central)
    console.log('> Insertando tareas para Bandeja Central...')
    const TAREAS_EJEMPLO = [
        { tipo: 'consulta', titulo: 'Consulta por Plan Sumar', descripcion: 'El paciente solicita información sobre cobertura de anteojos.', estado: 'pendiente', prioridad: 'baja' },
        { tipo: 'derivacion', titulo: 'Derivación Urgente a Capital', descripcion: 'Paciente con cuadro agudo requiere evaluación en Hospital San Juan.', estado: 'en_proceso', prioridad: 'alta' },
        { tipo: 'reclamo', titulo: 'Demora en asignación de turno', descripcion: 'Se queja por falta de comunicación tras 15 días de espera.', estado: 'pendiente', prioridad: 'media' },
        { tipo: 'documentacion', titulo: 'Validación de Historia Clínica', descripcion: 'Pendiente firma digital del director médico.', estado: 'resuelto', prioridad: 'media' },
        { tipo: 'consulta', titulo: 'Solicitud de Medicación Crónica', descripcion: 'Tratamiento prolongado de insulina.', estado: 'en_proceso', prioridad: 'alta' },
    ]

    for (let i = 0; i < Math.min(3, insertedPersonas.length); i++) {
        const persona = insertedPersonas[i]
        // Mezclar tareas para que no todos tengan lo mismo
        const subset = TAREAS_EJEMPLO.slice(i, i + 3)
        for (const t of subset) {
            const { error: taskErr } = await supabase.from('tareas').insert({
                tenant_id,
                persona_id: persona.id,
                tipo: t.tipo,
                titulo: t.titulo,
                descripcion: t.descripcion,
                estado: t.estado,
                prioridad: t.prioridad,
                created_by: '00000000-0000-0000-0000-000000000000'
            })
            if (taskErr) console.warn(`    ! Error al insertar tarea para ${persona.dni}: ${taskErr.message}`)
        }
    }
    console.log(`> Tareas de prueba generados.`)

    // 6. Asegurar Usuarios Demo para Ministerio
    console.log('> Asegurando usuarios demo (Ministerio)...')
    const DEMO_USERS = [
        { email: 'admin@demo.com', role: 'admin' },
        { email: 'profesional@demo.com', role: 'profesional' },
        { email: 'administrativo@demo.com', role: 'administrativo' },
    ]

    for (const du of DEMO_USERS) {
        // A) Intentar crear en Auth (o recuperar si ya existe)
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
            email: du.email,
            password: 'demo12345',
            email_confirm: true
        })

        let userId = authUser.user?.id

        if (authError) {
            if (authError.message.includes('already registered')) {
                // Recuperar ID por email si ya existe
                const { data: existing } = await supabase.auth.admin.listUsers()
                userId = existing.users.find(u => u.email === du.email)?.id
            } else {
                console.warn(`    ! Error al crear usuario ${du.email}: ${authError.message}`)
                continue
            }
        }

        if (userId) {
            // B) Upsert en perfiles con el rol y tenant
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    user_id: userId,
                    tenant_id,
                    email: du.email,
                    rol: du.role
                }, { onConflict: 'user_id' })

            if (profileError) {
                console.warn(`    ! Error al configurar perfil para ${du.email}: ${profileError.message}`)
            } else {
                console.log(`    + Usuario demo listo: ${du.email} [${du.role}]`)
            }
        }
    }

    console.log('> Finalizando perfiles y roles...')
    if (insertedPersonas.length > 0) {
        // Intentar asignar rol admin al perfil actual (del usuario que corre el seed)
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { error: roleErr } = await supabase
                .from('profiles')
                .update({ rol: 'admin' })
                .eq('user_id', user.id)

            if (roleErr) {
                console.warn(`! No se pudo auto-asignar rol admin al usuario actual: ${roleErr.message}`)
            } else {
                console.log(`+ Rol 'admin' asignado con éxito al usuario: ${user.email}`)
            }
        }
    }

    console.log('--- Seed Finalizado con Éxito ---')
}

seed().catch(console.error)
