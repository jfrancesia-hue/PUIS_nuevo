-- Semillas para PUIS Catamarca
-- Generar datos de prueba para demostración ministerial

-- 1. CREAR TENANT
INSERT INTO tenants (id, nombre)
VALUES ('00000000-0000-0000-0000-000000000001', 'Ministerio de Salud - Catamarca');

-- 2. CREAR UNIDAD ORGANIZATIVA
INSERT INTO org_units (id, tenant_id, nombre, tipo) 
VALUES ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Hospital Interzonal San Juan Bautista', 'hospital');

-- 3. CREAR PERFIL (Debe coincidir con un user_id real de auth.users si se desea probar login)
-- Nota: El user_id se debe obtener después de crear el usuario en Supabase Auth
-- INSERT INTO profiles (user_id, tenant_id, org_unit_id, rol, nombre, email)
-- VALUES ('UUID_DEL_USUARIO_AUTH', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'admin', 'Silvia Doe', 'silvia.doe@catamarca.gov.ar');

-- 4. CREAR PERSONAS (PACIENTES)
INSERT INTO personas (id, tenant_id, dni, nombre, apellido, fecha_nac, sexo, telefono, domicilio)
VALUES 
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '30123456', 'Ana', 'García', '1985-05-15', 'Femenino', '383 4556677', 'Av. Belgrano 123, Catamarca'),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '28998776', 'Juan', 'Pérez', '1982-11-20', 'Masculino', '383 4991122', 'Calle Junín 456, Catamarca');

-- 5. CREAR TURNOS
INSERT INTO turnos (tenant_id, persona_id, org_unit_id, fecha, especialidad, profesional, estado, notas)
VALUES 
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', NOW() + interval '1 day', 'Cardiología', 'Dr. Vazquez', 'confirmado', 'Control de hipertensión'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', NOW() - interval '15 days', 'Clínica Médica', 'Dra. Sosa', 'atendido', 'Chequeo general preventivo');

-- 6. CREAR RECLAMOS
INSERT INTO reclamos (tenant_id, persona_id, org_unit_id, categoria, descripcion, urgencia, estado)
VALUES 
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'Demora en Turnos', 'Demora de más de 2 meses para especialidad neurología', 'media', 'abierto');
