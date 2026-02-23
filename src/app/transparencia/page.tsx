"use client";

import { useState } from "react";

export default function Transparencia() {
    const [selectedRepo, setSelectedRepo] = useState<string | null>(null);

    const kpis = [
        { label: "Ocupación de Camas", value: "78%", trend: "Nivel Seguro", color: "text-emerald-500", icon: "🏥" },
        { label: "Turnos Atendidos", value: "48.210", trend: "↑ 12% Mensual", color: "text-[#0067b1]", icon: "📅" },
        { label: "Cobertura Vacunación", value: "91.5%", trend: "Meta lograda", color: "text-emerald-500", icon: "💉" },
        { label: "SLA Reclamos", value: "96%", trend: "Óptimo", color: "text-emerald-500", icon: "✅" },
    ];

    const logs = [
        { id: "LOG-9021", date: "30 Ene 2026 12:45", action: "Sincronización SIGESA", center: "Hosp. San Juan", status: "Certificado" },
        { id: "LOG-9022", date: "30 Ene 2026 11:20", action: "Auditoría Facturación", center: "Maternidad Prov.", status: "Certificado" },
        { id: "LOG-9023", date: "30 Ene 2026 09:15", action: "Carga SNVS (SISA)", center: "Epidemiología", status: "Certificado" },
        { id: "LOG-9024", date: "29 Ene 2026 18:00", action: "Update HCDU Nodo 04", center: "Caps Santa Rosa", status: "Certificado" },
    ];

    return (
        <div className="space-y-16 animate-fade-in max-w-7xl mx-auto py-10 font-outfit pb-24">
            {/* Public Header Institutional */}
            <section className="text-center space-y-8">
                <div className="inline-flex items-center gap-4 px-8 py-3 rounded-full bg-[#0067b1]/5 border-2 border-[#0067b1]/10 text-[#0067b1] text-[10px] font-black uppercase tracking-[0.4em] shadow-xl">
                    <span className="w-2 h-2 rounded-full bg-[#f9b000] animate-pulse"></span>
                    Gobierno de la Provincia de Catamarca
                </div>
                <h1 className="text-7xl font-black tracking-tighter text-zinc-900 leading-none">
                    PORTAL DE <span className="text-[#0067b1]">TRANSPARENCIA</span>
                </h1>
                <p className="text-2xl text-zinc-400 max-w-3xl mx-auto font-bold leading-relaxed italic">
                    Acceso abierto a los indicadores de gestión e impacto sanitario. <br />
                    <span className="text-zinc-900 border-b-4 border-[#f9b000]">Evidencia digital irrefutable</span> del sistema público.
                </p>
            </section>

            {/* Main KPIs Institutional Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {kpis.map((kpi, i) => (
                    <div key={i} className="p-12 rounded-[56px] bg-white border-2 border-zinc-50 hover:border-[#0067b1] transition-all shadow-2xl group text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-zinc-50 group-hover:bg-[#0067b1] transition-all" />
                        <div className="text-6xl mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all">{kpi.icon}</div>
                        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.3em] mb-3">{kpi.label}</p>
                        <h3 className="text-5xl font-black text-zinc-900 tracking-tighter">{kpi.value}</h3>
                        <div className="mt-8 flex items-center justify-center gap-2">
                            <span className={`text-[10px] font-black ${kpi.color} uppercase tracking-widest px-4 py-1.5 rounded-full bg-zinc-50 border border-zinc-100`}>{kpi.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Evidence Log */}
                <div className="lg:col-span-2 p-12 rounded-[64px] border-2 bg-white shadow-3xl space-y-12 relative overflow-hidden">
                    <div className="flex items-center justify-between relative z-10 border-b-2 border-dashed pb-8 border-zinc-100">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-tighter">Evidencia Digital</h2>
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Registro de auditoría sistemática en tiempo real</p>
                        </div>
                        <button className="px-6 py-3 bg-[#002b49] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-[#0067b1] transition-all">Exportar Log 📥</button>
                    </div>

                    <div className="space-y-4 relative z-10">
                        {logs.map((log, i) => (
                            <div key={i} className="flex items-center justify-between p-6 rounded-[32px] bg-zinc-50 border-2 border-zinc-50 hover:bg-white hover:border-[#0067b1]/20 transition-all group">
                                <div className="flex items-center gap-8">
                                    <span className="font-mono text-[10px] text-zinc-300 font-bold">{log.id}</span>
                                    <div>
                                        <p className="text-sm font-black text-zinc-900 group-hover:text-[#0067b1] transition-colors">{log.action}</p>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{log.center}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">{log.status} ✓</p>
                                    <p className="text-[9px] font-bold text-zinc-300 font-mono italic">{log.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#0067b1]/5 rounded-full blur-[80px]" />
                </div>

                {/* Impact Reports */}
                <div className="lg:col-span-1 p-12 rounded-[64px] bg-[#002b49] text-white flex flex-col justify-between overflow-hidden relative border-8 border-white/5 shadow-3xl">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black mb-6 uppercase tracking-tighter">BIBLIOTECA <br />DE GESTIÓN</h2>
                        <p className="text-sm font-bold text-sky-100/60 leading-relaxed mb-12 text-pretty italic border-l-4 border-[#f9b000] pl-6">Repisitorio oficial de decretos, resoluciones y reportes técnicos de la red sanitaria.</p>

                        <div className="space-y-4">
                            {['Enero 2026', 'Diciembre 2025', 'Noviembre 2025'].map((month) => (
                                <div
                                    key={month}
                                    onClick={() => setSelectedRepo(month)}
                                    className={`p-6 rounded-[32px] border-2 transition-all cursor-pointer group flex items-center justify-between ${selectedRepo === month ? 'bg-white text-[#002b49] border-white shadow-2xl' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{month}</span>
                                    <span className={`text-2xl transition-transform ${selectedRepo === month ? 'rotate-180 scale-125' : 'group-hover:translate-y-1'}`}>⌄</span>
                                </div>
                            ))}
                        </div>

                        {selectedRepo && (
                            <div className="mt-8 p-6 rounded-[32px] bg-white/10 animate-fade-in border-2 border-white/10 space-y-4">
                                <div className="flex items-center gap-4 hover:text-[#f9b000] cursor-pointer transition-colors">
                                    <span className="text-2xl">📄</span>
                                    <p className="text-[10px] font-black uppercase tracking-widest">Res. Ministerial #092-26.pdf</p>
                                </div>
                                <div className="flex items-center gap-4 hover:text-[#f9b000] cursor-pointer transition-colors">
                                    <span className="text-2xl">📊</span>
                                    <p className="text-[10px] font-black uppercase tracking-widest">Indicadores Q4-2025.xlsx</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] mt-20 text-center">Protocolo Transparencia Catamarca v2.0</p>

                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white opacity-5 rounded-full blur-[100px]" />
                </div>
            </div>

            {/* Final Info */}
            <div className="p-20 rounded-[80px] bg-gradient-to-br from-[#f9b000] to-[#f4c400] text-[#002b49] flex flex-col md:flex-row items-center justify-between gap-12 shadow-3xl text-center md:text-left">
                <div className="space-y-4">
                    <h2 className="text-6xl font-black tracking-tighter leading-none">DATOS CON <br />PROPÓSITO</h2>
                    <p className="text-xl font-bold opacity-70 leading-relaxed max-w-xl italic">"La transparencia no es solo información, es el compromiso de cada nodo con la excelencia sanitaria."</p>
                </div>
                <button className="px-16 py-8 bg-[#002b49] text-white rounded-[32px] font-black uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-[#002b49] transition-all shadow-2xl transform hover:-translate-y-2 active:scale-95">
                    Generar Auditoría Ciudadana ➔
                </button>
            </div>
        </div>
    );
}
