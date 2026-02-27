# PUIS Catamarca - Guía de Demo Ministerial

Bienvenido al prototipo funcional del **Plataforma Unificada de Información en Salud (PUIS)**. Esta guía detalla los pasos para realizar una demostración efectiva de las capacidades industriales del sistema.

## 🌐 Acceso al Sistema
- **URL**: [https://puis-catamarca.vercel.app](https://puis-catamarca.vercel.app) (Placeholder - Reemplazar con URL final)
- **Credenciales Sugeridas (Password: `demo12345` en todos):**
  - **Admin**: `admin@demo.com` (Control total, auditoría, dashboard)
  - **Profesional**: `profesional@demo.com` (Carga clínica, gestión de turnos)
  - **Administrativo**: `administrativo@demo.com` (Solo lectura de fichas, creación de tickets)

---

## 🚀 Flujo Recomendado de Demostración (5 Pasos)

1.  **Inicio de Sesión y Dashboard**:
    - Ingrese con el usuario `admin@demo.com`. Verá el **Dashboard de Gestión Humana** con el estado de los módulos operativos (Ficha, Turnos, Bandeja).

2.  **Búsqueda Inteligente**:
    - En la pantalla principal, use el buscador. Pruebe con el DNI sugerido: `20123456`. El sistema localizará instantáneamente al paciente Roberto Gomez.

3.  **Ficha Unificada y Documentación**:
    - Haga clic en **Abrir Ficha**. Explore las pestañas. En **"Documentos"**, suba un archivo PDF o JPG. Verá que se genera un hash de integridad, blindando la evidencia legal.

4.  **Agenda de Turnos**:
    - Cambie a la pestaña **"Turnos"**. Programe una nueva cita para mañana. Verá cómo aparece en la agenda centralizada. Cambie el estado a "Atendido" para simular el flujo del consultorio.

5.  **Bandeja Central (Mesa de Entrada)**:
    - Diríjase al módulo **"Bandeja Central"** desde el menú principal. Cree una nueva solicitud (ej: Reclamo de Medicación), asocie al paciente Roberto Gomez y muévala de "Pendiente" a "En Proceso" para demostrar la trazabilidad operativa.

---

## 🛡️ Seguridad y Auditoría Regional
- **Multitenancy**: Cada departamento o nodo de salud ve únicamente su propia información.
- **Auditoría Sistemática**: Cada acción (desde una búsqueda hasta una descarga de archivo) queda registrada con marca de tiempo y usuario en la tabla de eventos de auditoría, garantizando transparencia total ante el Ministerio.

---
*Este paquete representa el compromiso de modernización tecnológica para la provincia de Catamarca.*
