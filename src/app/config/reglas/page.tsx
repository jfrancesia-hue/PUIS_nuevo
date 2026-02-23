export default function MotorReglas() {
    const policies = [
        { id: 1, name: "SLA Zona Rural", condition: "Zona == 'Rural'", action: "Prioridad = Alta", status: "Active" },
        { id: 2, name: "Atención Adultos Mayores", condition: "Edad > 65", action: "Prioridad = Crítica + WhatsApp Automático", status: "Active" },
        { id: 3, name: "Alerta Stock Crítico", condition: "Stock < 10%", action: "Notificación Nivel 2 + Alerta IA", status: "Active" },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-fade-in py-8">
            <header className="space-y-2">
                <h1 className="text-4xl font-black font-outfit text-zinc-900 dark:text-zinc-50">Motor de Reglas <span className="text-accent">Dinámico</span></h1>
                <p className="text-zinc-500 font-medium">Configuración de políticas de salud sin tocar una sola línea de código.</p>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {policies.map((p) => (
                    <div key={p.id} className="p-8 rounded-[40px] border bg-white dark:bg-zinc-900/40 shadow-xl flex items-center justify-between group hover:border-accent transition-all">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-black font-outfit">{p.name}</h3>
                                <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">{p.status}</span>
                            </div>
                            <div className="flex gap-4 text-xs font-bold">
                                <span className="text-zinc-400 font-black uppercase tracking-widest text-[9px]">Si:</span>
                                <span className="text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-xl">"{p.condition}"</span>
                                <span className="text-zinc-400 font-black uppercase tracking-widest text-[9px]">Entonces:</span>
                                <span className="text-accent bg-accent/10 px-3 py-1 rounded-xl">"{p.action}"</span>
                            </div>
                        </div>
                        <button className="p-4 rounded-2xl border hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all opacity-0 group-hover:opacity-100 italic">Editar</button>
                    </div>
                ))}

                <button className="w-full py-8 rounded-[40px] border-4 border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 font-black uppercase tracking-widest hover:border-accent hover:text-accent transition-all">
                    + Añadir Nueva Política de Gestión
                </button>
            </div>

            {/* Scalability Template Hint */}
            <div className="p-10 rounded-[48px] bg-zinc-900 text-white flex flex-col items-center text-center space-y-6">
                <div className="text-4xl">🌍</div>
                <h3 className="text-2xl font-black font-outfit">Preparado para Escalar</h3>
                <p className="text-zinc-400 font-medium max-w-lg">Este motor permite replicar la configuración de Catamarca en cualquier municipio o provincia con un solo clic.</p>
                <div className="flex gap-4">
                    <button className="px-6 py-3 rounded-2xl bg-white/10 border border-white/10 text-xs font-bold hover:bg-white/20">Exportar Plantilla Municipal</button>
                    <button className="px-6 py-3 rounded-2xl bg-accent text-white text-xs font-bold shadow-xl">Desplegar en Nueva Entidad</button>
                </div>
            </div>
        </div>
    );
}
