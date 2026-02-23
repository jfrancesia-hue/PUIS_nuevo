export default function RegistroEvidencia() {
    const logs = [
        {
            id: "AUD-2026-001",
            action: "Auditoría de Stock Crítico - Amoxicilina",
            responsible: "Lic. Silvia Doe",
            date: "30/01 10:45",
            evidence: "Reposición Automática Ejecutada",
            before: "Quiebre de stock en CAPS Belén (0 unidades)",
            after: "Ingreso de 500 unidades y trazabilidad completa"
        },
        {
            id: "AUD-2026-002",
            action: "Sincronización de Ficha Unificada - Zona Serrana",
            responsible: "Dr. Vazquez",
            date: "30/01 09:15",
            evidence: "Integridad de datos 100%",
            before: "Datos fragmentados en 3 centros distintos",
            after: "Consolidación exitosa en Ficha Única Silvia Doe"
        },
        {
            id: "AUD-2026-003",
            action: "Control de SLA de Turnos - Cardiología",
            responsible: "Dirección de Calidad",
            date: "29/01 14:20",
            evidence: "Reducción de mora en derivaciones",
            before: "Espera promedio de 15 días para interconsulta",
            after: "Turnos asignados en menos de 48hs vía Portal"
        }
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-fade-in py-8">
            <header className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black font-outfit text-zinc-900 dark:text-zinc-50">Registro de <span className="text-accent">Evidencia</span></h1>
                    <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                        🛡️ Blindaje de Gestión Automatizado <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    </p>
                </div>
                <button className="px-8 py-4 rounded-2xl bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-xs font-black uppercase tracking-widest shadow-2xl">Exportar Auditoría Mensual</button>
            </header>

            <div className="space-y-6">
                {logs.map((log) => (
                    <div key={log.id} className="p-10 rounded-[48px] border bg-white dark:bg-zinc-900/40 shadow-xl space-y-8 group hover:border-accent transition-all overflow-hidden relative">
                        <div className="flex justify-between items-start relative z-10">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-black font-outfit">{log.action}</h2>
                                <p className="text-xs font-bold text-zinc-400">ID: {log.id} • {log.date} • Por: {log.responsible}</p>
                            </div>
                            <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                                Evidencia: {log.evidence}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            <div className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700/50">
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Escenario Previo</p>
                                <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400">{log.before}</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/20">
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Impacto Final</p>
                                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{log.after}</p>
                            </div>
                        </div>

                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-[0.03] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                    </div>
                ))}
            </div>
        </div>
    );
}
