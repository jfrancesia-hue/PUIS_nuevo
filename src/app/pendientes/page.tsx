"use client";

import { useState } from "react";

export default function Pendientes() {
    const [activeTask, setActiveTask] = useState<any | null>(null);
    const [filter, setFilter] = useState("TODOS");

    const initialTasks = [
        { id: 1, type: "Reclamo", title: "Falta Insumos Hemoterapia", center: "Hosp. San Juan", zone: "Capital", status: "Vencido", priority: "Alta", time: "1h ago", color: "red-500", details: "El stock de sangre O- ha llegado a niveles críticos. Se requiere reposición inmediata desde Banco Provincial.", sla: 100, sla_text: "⌛ SLA Vencido (Excedido: 2d)" },
        { id: 2, type: "Derivación", title: "Traslado Crítico (Pediatría)", center: "Zonal Belén", zone: "Belén", status: "Pendiente", priority: "Alta", time: "15m ago", color: "red-600", details: "Paciente neonato requiere traslado a UTI-NEO Maternidad Provincial por complicaciones respiratorias.", sla: 85, sla_text: "🕒 SLA Crítico (Restan: 45m)" },
        { id: 3, type: "Auditoría", title: "Revisión Protocolo Quirúrgico", center: "Maternidad Prov.", zone: "Capital", status: "En curso", priority: "Media", time: "30m ago", color: "blue-500", details: "Solicitud de revisión de checklist pre-operatorio tras incidente menor informado el 28/01.", sla: 45, sla_text: "🕒 SLA en curso (Restan: 8h 12m)" },
        { id: 4, type: "Alerta", title: "Corte suministro (Grupo Elect.)", center: "Hosp. de Pomán", zone: "Pomán", status: "Urgente", priority: "Alta", time: "5m ago", color: "amber-500", details: "El grupo electrógeno presentó falla en el último testeo automático. Se requiere service urgente de mantenimiento.", sla: 20, sla_text: "🕒 SLA Preventivo (Restan: 2h)" },
        { id: 5, type: "Farmacia", title: "Planilla Trazabilidad Medicamentos", center: "Caps Santa Rosa", zone: "Valle Viejo", status: "Pendiente", priority: "Baja", time: "4h ago", color: "emerald-500", details: "Carga de trazabilidad pendiente para el lote de Amoxicilina recibido el Lunes.", sla: 10, sla_text: "🕒 SLA Normal (Restan: 48h)" },
    ];

    const [tasks, setTasks] = useState(initialTasks);

    const handleResolve = (id: number) => {
        setTasks(tasks.filter(t => t.id !== id));
        setActiveTask(null);
    };

    return (
        <div className="space-y-10 py-4 animate-fade-in font-outfit pb-24">
            {/* Header & Stats */}
            <section className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50">
                        BANDEJA <span className="text-[#0067b1]">DE GESTIÓN</span>
                    </h1>
                    <p className="text-zinc-500 font-bold max-w-xl text-sm italic mt-2">Centralizador único de requerimientos ministeriales y alertas operativas.</p>
                </div>
                <div className="flex gap-6">
                    <div className="px-10 py-6 rounded-[32px] bg-white border-2 border-zinc-50 shadow-2xl text-center min-w-[160px] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[#0067b1]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest relative z-10">Total Activos</p>
                        <p className="text-4xl font-black text-[#0067b1] relative z-10">{tasks.length}</p>
                    </div>
                    <div className="px-10 py-6 rounded-[32px] bg-red-500/5 border-2 border-red-500/10 shadow-2xl text-center min-w-[160px] animate-pulse">
                        <p className="text-[10px] font-black uppercase text-red-500 tracking-widest">Vencidos</p>
                        <p className="text-4xl font-black text-red-600">08</p>
                    </div>
                </div>
            </section>

            {/* Advanced Filtering */}
            <div className="p-6 rounded-[32px] bg-white dark:bg-zinc-900/40 border-2 border-zinc-50 flex flex-wrap items-center gap-6 shadow-xl">
                {['TODOS', 'RECLAMOS', 'DERIVACIONES', 'ALERTAS'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? "bg-[#002b49] text-white shadow-xl" : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200"}`}
                    >
                        {f}
                    </button>
                ))}

                <div className="h-10 w-[2px] bg-zinc-100 dark:bg-zinc-700 mx-2 hidden lg:block" />

                <div className="flex-1 min-w-[300px] relative group">
                    <input
                        type="text"
                        placeholder="Buscar por centro, zona o título..."
                        className="w-full pl-12 pr-6 py-4 rounded-[22px] bg-zinc-50 border-2 border-transparent focus:border-[#0067b1] focus:bg-white text-sm font-bold outline-none transition-all shadow-inner"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl grayscale opacity-30 group-focus-within:opacity-100 transition-opacity">🔎</span>
                </div>
            </div>

            {/* Task List */}
            <div className="grid grid-cols-1 gap-6">
                {tasks.map((task) => (
                    <div key={task.id} className="group relative p-10 rounded-[56px] border-2 bg-white dark:bg-zinc-900/50 hover:border-[#0067b1]/40 shadow-2xl transition-all duration-500 hover:-translate-y-1">
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10">
                            <div className="flex items-start gap-10">
                                <div className={`w-24 h-24 rounded-[40px] bg-zinc-50 flex items-center justify-center text-4xl group-hover:scale-110 group-hover:rotate-6 transition-all shadow-inner border-2 border-zinc-50`}>
                                    {task.type === 'Reclamo' ? '📢' : task.type === 'Derivación' ? '🚑' : task.type === 'Auditoría' ? '🏆' : task.type === 'Alerta' ? '🚨' : '💊'}
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4">
                                        <span className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full border-2 bg-zinc-50 tracking-widest ${task.status === 'Vencido' ? 'text-red-500 border-red-500/20' : 'text-[#0067b1] border-[#0067b1]/20'}`}>
                                            {task.type}
                                        </span>
                                        <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-2 uppercase tracking-widest">
                                            <span className="w-2 h-2 rounded-full bg-zinc-300"></span> {task.time}
                                        </span>
                                    </div>
                                    <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 group-hover:text-[#0067b1] transition-colors tracking-tighter">
                                        {task.title}
                                    </h3>
                                    <p className="text-sm font-black text-zinc-400 tracking-widest uppercase">
                                        {task.center} • <span className="text-[#0067b1]">{task.zone}</span>
                                    </p>

                                    {/* SLA Logic Progress */}
                                    <div className="mt-8 max-w-sm space-y-3">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest px-1">
                                            <span className={task.status === 'Vencido' ? 'text-red-500' : 'text-zinc-400'}>{task.sla_text}</span>
                                        </div>
                                        <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border-4 border-white shadow-inner">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${task.status === 'Vencido' ? 'bg-red-500 w-full' : 'bg-[#0067b1]'} `}
                                                style={{ width: task.status === 'Vencido' ? '100%' : `${task.sla}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-10">
                                <div className="text-right hidden sm:block space-y-2">
                                    <div className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl shadow-sm ${task.priority === 'Alta' ? 'bg-red-600 text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                                        Prioridad {task.priority}
                                    </div>
                                    <p className="text-xs font-black text-zinc-400 uppercase tracking-widest italic">{task.status}</p>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setActiveTask(task)}
                                        className="px-12 py-6 rounded-[32px] bg-[#0067b1] text-white text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-[#002b49] hover:-translate-y-1 transition-all active:scale-95"
                                    >
                                        Gestionar
                                    </button>
                                    <button className="w-20 h-20 rounded-[32px] border-4 border-zinc-50 hover:bg-zinc-50 transition-all flex items-center justify-center text-3xl shadow-xl">
                                        ⋯
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Side Indicator */}
                        {task.status === 'Vencido' && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-32 bg-red-500 rounded-r-[32px] shadow-2xl" />
                        )}
                    </div>
                ))}
            </div>

            <div className="flex justify-center pt-10">
                <button className="px-12 py-6 rounded-[32px] border-4 border-zinc-50 text-[11px] font-black text-zinc-400 uppercase tracking-[0.4em] hover:text-[#0067b1] hover:border-[#0067b1]/30 transition-all">
                    Cargar mas pendientes SIGESA
                </button>
            </div>

            {/* MANAGEMENT MODAL */}
            {activeTask && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#002b49]/80 backdrop-blur-xl animate-fade-in">
                    <div className="bg-white w-full max-w-4xl rounded-[64px] shadow-2xl overflow-hidden animate-slide-in-top border-8 border-white/20">
                        <div className={`p-12 text-white flex justify-between items-start ${activeTask.status === 'Vencido' ? 'bg-red-600' : 'bg-[#0067b1]'}`}>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">ID Ticket: #2026-00{activeTask.id}</p>
                                <h2 className="text-4xl font-black tracking-tighter uppercase">{activeTask.title}</h2>
                                <p className="text-sm font-bold opacity-80">{activeTask.center} • {activeTask.zone}</p>
                            </div>
                            <button onClick={() => setActiveTask(null)} className="w-16 h-16 rounded-[28px] bg-white/10 hover:bg-white/20 text-white text-4xl transition-all">✕</button>
                        </div>
                        <div className="p-12 space-y-10">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b-2 border-dashed pb-2">Descripción del Requerimiento</h4>
                                <p className="text-xl font-bold text-zinc-800 leading-relaxed italic">"{activeTask.details}"</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-8 rounded-[40px] bg-zinc-50 border-2 border-zinc-50 space-y-2">
                                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">SLA Restante</p>
                                    <p className="text-2xl font-black text-zinc-900">{activeTask.sla_text}</p>
                                </div>
                                <div className="p-8 rounded-[40px] bg-zinc-50 border-2 border-zinc-50 space-y-2">
                                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Auditoría Provincial</p>
                                    <p className="text-2xl font-black text-emerald-600">CERTIFICADO OK</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6 pt-10 border-t-4 border-zinc-50 border-dashed">
                                <button className="py-8 rounded-[32px] bg-zinc-100 text-zinc-900 font-black uppercase tracking-widest text-[10px] hover:bg-[#002b49] hover:text-white transition-all">Derivar Nodo</button>
                                <button className="py-8 rounded-[32px] bg-zinc-100 text-zinc-900 font-black uppercase tracking-widest text-[10px] hover:bg-[#002b49] hover:text-white transition-all">Añadir Evidencia</button>
                                <button
                                    onClick={() => handleResolve(activeTask.id)}
                                    className="py-8 rounded-[32px] bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-emerald-600 hover:-translate-y-1 transition-all"
                                >Resolver Requerimiento</button>
                            </div>
                        </div>
                        <footer className="p-8 bg-zinc-950 text-white/30 text-[9px] font-black uppercase tracking-[0.3em] flex justify-between">
                            <span>NODAL-SYS-CAT-09</span>
                            <span>Protocolo de Seguridad AES-256</span>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
}
