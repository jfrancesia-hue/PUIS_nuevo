export default function ExpedienteDetalle() {
    const steps = [
        { date: "30/01 09:12", user: "Admin Central", action: "Aprobación Ministerial", detail: "Firma digital aplicada por Dra. Silvia R. (Directora)", status: "done" },
        { date: "29/01 15:45", user: "Gobernanza IA", action: "Validación Automática", detail: "Dato normalizado y verificado contra duplicados.", status: "done" },
        { date: "29/01 10:20", user: "Jefe de Centro", action: "Validación de Requerimiento", detail: "El requerimiento cumple con los protocolos de urgencia.", status: "done" },
        { date: "28/01 22:10", user: "Operador Sanitario", action: "Registro Inicial", detail: "Carga de datos y evidencia desde zona sin conexión.", status: "done" },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-fade-in py-8">
            <header className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black font-outfit text-zinc-900 dark:text-zinc-50">Expediente #3928-C</h1>
                    <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                        📂 Trazabilidad Digital Completa <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    </p>
                </div>
                <button className="px-6 py-3 rounded-2xl bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-xs font-black uppercase tracking-widest shadow-xl">Imprimir Registro</button>
            </header>

            {/* Visual Timeline */}
            <div className="p-10 rounded-[48px] border bg-white dark:bg-zinc-900/40 shadow-2xl relative">
                <div className="absolute left-[3.25rem] top-24 bottom-24 w-1 bg-zinc-100 dark:bg-zinc-800" />

                <div className="space-y-12">
                    {steps.map((step, i) => (
                        <div key={i} className="flex gap-10 relative">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl z-10 shadow-lg ${step.status === 'done' ? 'bg-emerald-500 text-white' : 'bg-zinc-100'}`}>
                                {i === 0 ? '✍️' : '🔘'}
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-black font-outfit">{step.action}</h3>
                                    <span className="text-xs font-bold text-zinc-400">{step.date}</span>
                                </div>
                                <p className="text-sm font-medium text-zinc-500">{step.detail}</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-zinc-200" />
                                    <span className="text-[10px] font-black uppercase text-zinc-400">Por: {step.user}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Signature Status Component */}
            <div className="p-8 rounded-[40px] bg-zinc-900 text-white flex items-center justify-between overflow-hidden relative">
                <div className="relative z-10">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-accent">Jerarquía de Firma</h4>
                    <div className="flex items-center gap-4">
                        {['OP', 'JC', 'DI', 'MI'].map((role, i) => (
                            <div key={role} className="flex items-center gap-2">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black border ${i < 4 ? 'bg-accent border-accent text-white' : 'border-white/20 opacity-40'}`}>
                                    {role}
                                </div>
                                {i < 3 && <div className="w-4 h-[2px] bg-accent" />}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="text-right relative z-10">
                    <p className="text-xs font-bold opacity-70">Estado Final</p>
                    <p className="text-xl font-black text-emerald-400">Aprobado & Firmado</p>
                </div>
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-accent rounded-full blur-3xl opacity-20" />
            </div>
        </div>
    );
}
