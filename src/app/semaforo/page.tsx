"use client";

import { useState } from "react";

export default function Semaforo() {
    const [selectedCenter, setSelectedCenter] = useState<any | null>(null);
    const [view, setView] = useState<"lista" | "mapa">("lista");
    const [filterZone, setFilterZone] = useState("Todas las zonas");

    const centers = [
        {
            id: "H-001",
            name: "Hospital San Juan Bautista",
            zone: "Capital",
            status: "red",
            reasons: ["Saturación en Shock-Room", "Déficit Sangre O-"],
            stock: "Crítico",
            score: 42,
            stats: { camas: 120, libres: 2, medicos: 18, guardia: "Saturada" },
            history: [
                { time: "08:12", event: "Alerta Roja - Capacidad Máxima" },
                { time: "10:45", event: "Recepción 5 Derivaciones SAME" }
            ]
        },
        {
            id: "H-002",
            name: "Maternidad Provincial 25 de Mayo",
            zone: "Capital",
            status: "yellow",
            reasons: ["Alta demanda Neonatología", "Turnos mañana al 95%"],
            stock: "Estable",
            score: 75,
            stats: { camas: 60, libres: 8, medicos: 12, guardia: "Demorada" },
            history: [
                { time: "09:00", event: "Ingreso derivación Belén" }
            ]
        },
        {
            id: "H-003",
            name: "Hospital Niños Eva Perón",
            zone: "Capital",
            status: "green",
            reasons: ["Operación Controlada", "Insumos Óptimos"],
            stock: "Óptimo",
            score: 94,
            stats: { camas: 80, libres: 25, medicos: 15, guardia: "Fluida" },
            history: []
        },
        {
            id: "H-004",
            name: "Hospital Zonal de Belén",
            zone: "Interior Profundo",
            status: "red",
            reasons: ["Inestabilidad Eléctrica", "Sin Especialista UTI"],
            stock: "Crítico",
            score: 15,
            stats: { camas: 30, libres: 1, medicos: 3, guardia: "Crítica" },
            history: [
                { time: "07:30", event: "Falla Grupo Electrógeno" }
            ]
        },
        {
            id: "H-005",
            name: "Hospital de Pomán",
            zone: "Pomán",
            status: "yellow",
            reasons: ["Derivaciones Pendientes", "Stock Amoxicilina bajo"],
            stock: "Alerta",
            score: 61,
            stats: { camas: 25, libres: 5, medicos: 4, guardia: "Normal" },
            history: []
        }
    ];

    const filtered = centers.filter(c => filterZone === "Todas las zonas" || c.zone === filterZone);

    return (
        <div className="space-y-10 py-4 animate-fade-in font-outfit pb-24">
            {/* Header */}
            <section className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="w-12 h-1 bg-[#0067b1] rounded-full"></span>
                        <p className="text-[#0067b1] text-xs font-black uppercase tracking-[0.3em]">Monitoreo en Tiempo Real</p>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50">
                        SEMÁFORO <span className="text-zinc-400">DE GESTIÓN</span>
                    </h1>
                    <p className="text-zinc-500 font-bold max-w-xl text-sm italic mt-2">Visibilidad operativa absoluta de los nodos de salud de la provincia.</p>
                </div>
                <div className="flex bg-zinc-50 dark:bg-zinc-950 p-2 rounded-[28px] border-2 border-zinc-100 shadow-xl overflow-hidden">
                    <button
                        onClick={() => setView("mapa")}
                        className={`px-8 py-4 rounded-[22px] text-[10px] font-black uppercase tracking-widest transition-all ${view === "mapa" ? "bg-white dark:bg-zinc-800 shadow-md text-zinc-900" : "text-zinc-400 hover:text-zinc-600"}`}
                    >
                        🛰️ Geo-Mapa
                    </button>
                    <button
                        onClick={() => setView("lista")}
                        className={`px-8 py-4 rounded-[22px] text-[10px] font-black uppercase tracking-widest transition-all ${view === "lista" ? "bg-white dark:bg-zinc-800 shadow-md text-zinc-900" : "text-zinc-400 hover:text-zinc-600"}`}
                    >
                        📋 Listado
                    </button>
                </div>
            </section>

            {/* Global Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { color: "red", count: "02", label: "Alerta Crítica", desc: "Requiere Intervención Inmediata" },
                    { color: "yellow", count: "14", label: "Bajo Seguimiento", desc: "Capacidad Operativa al Límite" },
                    { color: "emerald", count: "32", label: "Flujo Óptimo", desc: "Nodos Operando sin Novedad" }
                ].map((stat, i) => (
                    <div key={i} className={`p-10 rounded-[56px] border-2 flex items-center gap-8 shadow-2xl transition-all hover:scale-[1.02] ${stat.color === 'red' ? 'bg-red-500/5 border-red-500/20' : stat.color === 'yellow' ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
                        <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center text-4xl shadow-xl ${stat.color === 'red' ? 'bg-red-500 text-white animate-pulse' : stat.color === 'yellow' ? 'bg-yellow-500 text-white' : 'bg-emerald-500 text-white'}`}>
                            {stat.color === 'red' ? '🔴' : stat.color === 'yellow' ? '🟡' : '🟢'}
                        </div>
                        <div>
                            <p className={`text-6xl font-black ${stat.color === 'red' ? 'text-red-600' : stat.color === 'yellow' ? 'text-yellow-600' : 'text-emerald-600'} tracking-tighter leading-none`}>{stat.count}</p>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mt-2">{stat.label}</p>
                            <p className="text-[11px] font-bold text-zinc-500 italic mt-1">{stat.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            {view === "lista" ? (
                <div className="space-y-6">
                    <div className="flex justify-between items-center px-4">
                        <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.4em]">Resumen de Nodos</h3>
                        <select
                            className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none border-b-2 border-zinc-100 pb-1 cursor-pointer"
                            value={filterZone}
                            onChange={(e) => setFilterZone(e.target.value)}
                        >
                            <option>Todas las zonas</option>
                            <option>Capital</option>
                            <option>Interior Profundo</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {filtered.map((center, i) => (
                            <div key={i} className={`group p-10 flex flex-col md:flex-row md:items-center justify-between gap-10 rounded-[64px] border-2 bg-white shadow-2xl transition-all overflow-hidden relative ${center.status === 'red' ? 'hover:border-red-500/40' : 'hover:border-[#0067b1]/40'}`}>
                                {/* Visual Accent */}
                                <div className={`w-3 h-32 rounded-full absolute left-0 top-1/2 -translate-y-1/2 ${center.status === 'red' ? 'bg-red-500' : center.status === 'yellow' ? 'bg-yellow-500' : 'bg-emerald-500'}`} />

                                <div className="flex items-center gap-10 max-w-sm">
                                    <div className="text-center space-y-2">
                                        <p className="text-4xl font-black text-zinc-900 tracking-tighter">{center.score}%</p>
                                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">Índice<br />Eficiencia</p>
                                    </div>
                                    <div className="h-16 w-0.5 bg-zinc-100 hidden md:block" />
                                    <div>
                                        <h3 className="text-2xl font-black text-zinc-900 group-hover:text-[#0067b1] transition-colors tracking-tight">{center.name}</h3>
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1 flex items-center gap-2">
                                            📍 {center.zone} • <span className={center.status === 'red' ? 'text-red-500' : 'text-zinc-500'}>Stock: {center.stock}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-3">
                                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-zinc-300"></span> Observaciones Críticas
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {center.reasons.map((r, ri) => (
                                            <span key={ri} className={`px-4 py-2 rounded-2xl text-[10px] font-bold border-2 transition-all ${center.status === 'red' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-zinc-50 border-zinc-100 text-zinc-500'}`}>
                                                {r}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-10">
                                    <div className="text-right space-y-1">
                                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Estado Guardia</p>
                                        <p className={`text-sm font-black uppercase ${center.stats.guardia === 'Saturada' || center.stats.guardia === 'Crítica' ? 'text-red-500' : 'text-emerald-600'}`}>{center.stats.guardia}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedCenter(center)}
                                        className="px-10 py-5 rounded-[28px] bg-zinc-900 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-[#0067b1] hover:-translate-y-1 active:scale-95 transition-all"
                                    >
                                        Detalles Pro
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="h-[600px] rounded-[64px] bg-zinc-50 border-4 border-dashed border-zinc-200 flex flex-col items-center justify-center text-center p-20 space-y-8 shadow-inner overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0067b1]/5 to-transparent pointer-events-none" />
                    <div className="text-8xl">🛰️</div>
                    <div className="space-y-2 relative z-10">
                        <h3 className="text-4xl font-black text-zinc-900 tracking-tighter">Vista Satelital SIGESA</h3>
                        <p className="text-zinc-500 font-bold max-w-lg mx-auto">Sincronizando coordenadas GIS de los 348 nodos de salud provinciales...</p>
                    </div>
                    <div className="w-64 h-2 bg-zinc-100 rounded-full overflow-hidden relative z-10">
                        <div className="h-full bg-[#0067b1] w-2/3 animate-pulse"></div>
                    </div>
                </div>
            )}

            {/* CENTER DETAIL MODAL */}
            {selectedCenter && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#002b49]/80 backdrop-blur-xl animate-fade-in">
                    <div className="bg-white w-full max-w-5xl rounded-[64px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-in-top border-4 border-[#0067b1]/10">
                        <div className="p-12 border-b-2 border-zinc-50 flex justify-between items-start bg-zinc-50/50">
                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">{selectedCenter.zone} • ID: {selectedCenter.id}</p>
                                <h2 className="text-4xl font-black text-zinc-900 tracking-tighter leading-none">{selectedCenter.name}</h2>
                                <div className="flex items-center gap-4 pt-1">
                                    <div className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border-2 ${selectedCenter.status === 'red' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600'}`}>
                                        Módulo Crítico Activado
                                    </div>
                                    <span className="text-[10px] font-bold text-zinc-400 italic">Sincronizado: hace 42 seg.</span>
                                </div>
                            </div>
                            <button onClick={() => setSelectedCenter(null)} className="w-16 h-16 rounded-[28px] bg-white border-2 border-zinc-100 text-zinc-400 hover:text-red-500 hover:border-red-500 flex items-center justify-center text-3xl shadow-xl transition-all">✕</button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-12 space-y-12">
                            {/* Detail Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {[
                                    { label: "Camas Totales", val: selectedCenter.stats.camas, icon: "🩺" },
                                    { label: "Camas Libres", val: selectedCenter.stats.libres, icon: "🛏️", highlight: true },
                                    { label: "Staff Médico", val: selectedCenter.stats.medicos, icon: "👨‍⚕️" },
                                    { label: "Eficiencia", val: selectedCenter.score + "%", icon: "📊" }
                                ].map((s, i) => (
                                    <div key={i} className="p-8 rounded-[40px] bg-zinc-50 border-2 border-zinc-50 flex flex-col items-center justify-center text-center space-y-2 hover:bg-white hover:border-[#0067b1]/20 transition-all">
                                        <span className="text-3xl mb-2">{s.icon}</span>
                                        <p className="text-4xl font-black text-zinc-900 tracking-tight">{s.val}</p>
                                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{s.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* History Timeline */}
                            <div className="space-y-6">
                                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-[0.3em] flex items-center gap-4">
                                    <span className="w-2 h-8 bg-[#0067b1] rounded-full"></span> Log de Eventos Recientes
                                </h3>
                                <div className="space-y-4">
                                    {selectedCenter.history.length > 0 ? selectedCenter.history.map((h: any, hi: number) => (
                                        <div key={hi} className="flex gap-6 items-start p-6 rounded-3xl bg-red-500/5 border-2 border-red-500/10">
                                            <span className="text-xs font-black text-red-500 bg-white px-3 py-1 rounded-lg border-2 border-red-100">{h.time}</span>
                                            <p className="text-sm font-bold text-red-800">{h.event}</p>
                                        </div>
                                    )) : (
                                        <div className="p-10 rounded-3xl border-2 border-dashed border-zinc-100 text-center text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
                                            No se registran alertas críticas en las últimas 24 horas
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Command Actions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10 border-t-2 border-zinc-50">
                                <button className="p-10 rounded-[48px] border-4 border-[#0067b1]/20 hover:bg-[#0067b1] hover:text-white transition-all text-left space-y-2 group shadow-2xl">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Emergencia SAME</p>
                                    <p className="font-black text-2xl group-hover:translate-x-4 transition-transform">Solicitar Refuerzo →</p>
                                </button>
                                <button className="p-10 rounded-[48px] border-4 border-[#f9b000]/20 hover:bg-[#f9b000] hover:text-[#002b49] transition-all text-left space-y-2 group shadow-2xl">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Logística Integral</p>
                                    <p className="font-black text-2xl group-hover:translate-x-4 transition-transform">Despachar Insumos →</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom info section */}
            <div className="mt-20 p-16 rounded-[80px] bg-gradient-to-br from-[#002b49] via-[#00477a] to-[#0067b1] text-white flex flex-col md:flex-row items-center justify-between gap-12 shadow-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -mr-40 -mt-40" />
                <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-6">
                        <div className="text-6xl">🚥</div>
                        <div>
                            <h3 className="text-5xl font-black tracking-tighter">GESTIÓN POR EVIDENCIA</h3>
                            <p className="text-sky-100/60 font-bold text-lg italic mt-1">El estado de cada nodo es auditado bajo el protocolo Auditoría-PROV-Catamarca.</p>
                        </div>
                    </div>
                </div>
                <button className="relative z-10 px-12 py-8 bg-[#f9b000] text-[#002b49] rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:bg-white transition-all shadow-2xl active:scale-95 group">
                    Generar Reporte de Crisis <span className="inline-block group-hover:rotate-12 ml-2">📥</span>
                </button>
            </div>
        </div>
    );
}
