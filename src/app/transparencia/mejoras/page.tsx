export default function MejorasTransparencia() {
    const improvements = [
        {
            id: 1,
            title: "Digitalización de Turnos - Zona Sur",
            desc: "Implementación de agenda web y recordatorios por WhatsApp.",
            impact: "Reducción de colas en un 80%",
            date: "Dic 2025",
            who: "Dpto. Innovación",
            before: "Colas desde las 5 AM, papel.",
            after: "Cero colas, gestión 100% digital."
        },
        {
            id: 2,
            title: "Respuesta en Farmacia Hospital Regional",
            desc: "Optimización de stock crítico mediante el semáforo automático.",
            impact: "Baja de quiebre de stock: 15% -> 2%",
            date: "Nov 2025",
            who: "Logística Sanitaria",
            before: "Insumos agotados sin aviso previo.",
            after: "Reposición predictiva automatizada."
        }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-fade-in py-8">
            <header className="space-y-4">
                <a href="/transparencia" className="text-xs font-bold text-accent uppercase tracking-widest hover:underline">← Volver al Dashboard</a>
                <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-50 font-outfit">
                    Registro Histórico de <span className="gradient-text">Mejoras</span>
                </h1>
                <p className="text-zinc-500 font-medium text-lg">Evidencia transparente del impacto de la tecnología en la salud pública.</p>
            </header>

            <div className="space-y-8">
                {improvements.map((imp) => (
                    <div key={imp.id} className="p-10 rounded-[48px] border bg-white dark:bg-zinc-900/40 shadow-xl space-y-8 group hover:border-accent transition-all">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 font-outfit">{imp.title}</h2>
                                <p className="text-zinc-500 font-medium">{imp.desc}</p>
                            </div>
                            <span className="px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                                {imp.impact}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-6 rounded-3xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2">Escenario Anterior</p>
                                <p className="text-sm font-semibold text-red-700 dark:text-red-400">{imp.before}</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Impacto Actual</p>
                                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{imp.after}</p>
                            </div>
                        </div>

                        <div className="pt-6 border-t flex items-center justify-between">
                            <div className="flex gap-8">
                                <div>
                                    <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Fecha</p>
                                    <p className="text-xs font-bold">{imp.date}</p>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Responsable</p>
                                    <p className="text-xs font-bold">{imp.who}</p>
                                </div>
                            </div>
                            <button className="text-xs font-black uppercase tracking-widest text-accent flex items-center gap-2 group-hover:gap-4 transition-all">
                                Ver Evidencia Completa <span>→</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Monthly PDF Export */}
            <section className="p-10 rounded-[48px] bg-accent text-white flex flex-col items-center text-center space-y-6 shadow-2xl overflow-hidden relative">
                <div className="text-5xl mb-2">📑</div>
                <h3 className="text-3xl font-black font-outfit">Reporte de Impacto Automatizado</h3>
                <p className="text-white/80 max-w-lg font-medium">Este documento resume todos los registros de mejora del mes y genera un informe de gestión oficial en formato PDF.</p>
                <button className="px-10 py-5 bg-white text-accent rounded-3xl font-black uppercase tracking-tighter text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
                    Descargar Reporte del Mes (.PDF)
                </button>

                <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            </section>
        </div>
    );
}
