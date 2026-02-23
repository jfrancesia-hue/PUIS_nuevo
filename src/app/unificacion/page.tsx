"use client";

import { useState } from "react";

export default function UnificacionDirecciones() {
    const [selectedDir, setSelectedDir] = useState<string | null>(null);
    const [activeItem, setActiveItem] = useState<{ dir: string, mod: string, item: string, data?: any } | null>(null);
    const [search, setSearch] = useState("");
    const [selectedSec, setSelectedSec] = useState<string>("TODAS");

    const secretarias = [
        "TODAS",
        "SECRETARÍA DE SALUD",
        "SECRETARÍA DE PLANIFICACIÓN Y GESTIÓN",
        "SECRETARÍA DE MEDICINA PREVENTIVA",
        "DEPARTAMENTO DE EMERGENCIAS (SAME)"
    ];

    const directions = [
        {
            id: "DIR-001",
            sec: "SECRETARÍA DE MEDICINA PREVENTIVA",
            name: "Dirección Provincial de Epidemiología",
            leader: "Dra. Gloria Barrionuevo",
            email: "epidemiologia@salud.catamarca.gov.ar",
            internal_ip: "10.0.12.50",
            status: "Activo",
            sigesa_mod: "SISA Sync",
            color: "blue",
            modules: [
                {
                    name: "SALA DE SITUACIÓN (SIGESA)",
                    items: ["Monitoreo Dengue", "Vigilancia SISA", "Alertas Epidemiológicas"],
                    stats: { label: "Notificaciones SISA/Sem", values: [120, 150, 140, 180], total: "590", trend: "+12%" },
                    table: [
                        { fecha: "2026-01-30", evento: "Dengue", zona: "Capital", estado: "Notificado SISA" },
                        { fecha: "2026-01-30", evento: "COVID-19", zona: "Valle Viejo", estado: "Confirmado" }
                    ]
                },
                { name: "SISA (SISTEMA NACIONAL)", items: ["Sincronización SNVS", "Carga Diferida", "Validación de Casos"] }
            ]
        },
        {
            id: "DIR-006",
            sec: "SECRETARÍA DE PLANIFICACIÓN Y GESTIÓN",
            name: "Dirección de Administración (SAMIC)",
            leader: "C.P.N. Luis Rodriguez",
            email: "administracion@salud.catamarca.gov.ar",
            internal_ip: "10.0.10.22",
            status: "Activo",
            sigesa_mod: "SAMIC / Recupero",
            color: "amber",
            modules: [
                {
                    name: "RECUPERO DE COSTOS (SAMIC)",
                    items: ["Facturación Obras Sociales", "Liquidación de Prestaciones", "Auditoría Contable"],
                    stats: { label: "Recaudación (Millones $)", values: [12.5, 15.2, 14.8, 18.1], total: "60.6M", trend: "+20%" },
                    table: [
                        { id_factura: "F-9021", entidad: "OSEP", monto: "$125.000", estado: "Liquidado" },
                        { id_factura: "F-9022", entidad: "PAMI", monto: "$85.500", estado: "En Auditoría" }
                    ]
                }
            ]
        },
        {
            id: "DIR-003",
            sec: "SECRETARÍA DE PLANIFICACIÓN Y GESTIÓN",
            name: "Dirección de Salud Digital",
            leader: "Lic. Federico Innamurato",
            email: "salud.digital@salud.catamarca.gov.ar",
            internal_ip: "10.0.14.10",
            status: "Activo",
            sigesa_mod: "HCDU / SIGESA Core",
            color: "sky",
            modules: [
                {
                    name: "SIGESA CORE (HCDU)",
                    items: ["Historia Clínica Digital", "Gestión de Turnos Centralizada", "Referencia/Contrarreferencia"],
                    stats: { label: "HCE Activas (Miles)", values: [250, 265, 280, 295], total: "295K", trend: "+3%" },
                    table: [
                        { paciente: "GOMEZ, ANA", hcu: "12.890.342", centro: "Hosp. San Juan", accion: "Consulta Médica" },
                        { paciente: "LOPEZ, JUAN", hcu: "22.567.110", centro: "Caps Norte", accion: "Turno Asignado" }
                    ]
                }
            ]
        },
        {
            id: "DIR-007",
            sec: "DEPARTAMENTO DE EMERGENCIAS (SAME)",
            name: "Dirección de SAME 107",
            leader: "Dr. Nicolas Orellana",
            email: "same@salud.catamarca.gov.ar",
            internal_ip: "10.0.12.99",
            status: "Crítico",
            sigesa_mod: "Gestión de Camas",
            color: "red",
            modules: [
                {
                    name: "CENTRO DE DESPACHO 107",
                    items: ["Gestión Camas Críticas", "Derivaciones Activas", "Flota de Ambulancias"],
                    stats: { label: "Llamadas/Día", values: [450, 520, 610, 580], total: "2160", trend: "+15%" },
                    table: [
                        { movil: "SAME 04", origen: "Ruta 38", destino: "Hosp. San Juan", estado: "En Traslado" },
                        { movil: "SAME 12", origen: "Capital", destino: "Hosp. de Niños", estado: "Disponible" }
                    ]
                }
            ]
        },
        {
            id: "DIR-002",
            sec: "SECRETARÍA DE SALUD",
            name: "Dirección de Maternidad e Infancia",
            leader: "Dra. Maria Eugenia Albeastur",
            email: "maternidad@salud.catamarca.gov.ar",
            internal_ip: "10.0.12.55",
            status: "Activo",
            sigesa_mod: "Red Perinatal",
            color: "emerald",
            modules: [
                {
                    name: "RED DE NEONATOLOGÍA (SIGESA)",
                    items: ["Disponibilidad Incubadoras", "Traslados UTI-NEO", "Oxígeno Central"],
                    stats: { label: "Ocupación %", values: [88, 92, 85, 95], total: "95%", trend: "Crítico" },
                    table: [
                        { centro: "Hosp. Maternidad", camas: 12, ocupadas: 11, estado: "Lleno" },
                        { centro: "Hosp. El Rodeo", camas: 2, ocupadas: 0, estado: "Disponible" }
                    ]
                }
            ]
        }
    ];

    const filtered = directions.filter(d =>
        (selectedSec === "TODAS" || d.sec === selectedSec) &&
        (d.name.toLowerCase().includes(search.toLowerCase()) || d.leader.toLowerCase().includes(search.toLowerCase()))
    );

    const handleOpenItem = (dir: any, mod: any, item: string) => {
        setActiveItem({
            dir: dir.name,
            mod: mod.name,
            item,
            data: { stats: mod.stats, table: mod.table }
        });
    };

    return (
        <div className="space-y-10 py-8 animate-fade-in pb-20 relative font-outfit">
            {/* Header SIGESA STYLE */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <span className="bg-[#f9b000] text-[#002b49] px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">Powered by SIGESA Pro</span>
                        <p className="text-[#0067b1] text-xs font-black uppercase tracking-[0.3em]">Cerebro de Gestión Ministerial</p>
                    </div>
                    <h1 className="text-5xl font-black text-zinc-900 tracking-tighter">
                        UNIFICACIÓN <span className="text-zinc-400">DE SECRETARÍAS</span>
                    </h1>
                    <p className="text-zinc-500 font-bold max-w-2xl text-sm">
                        Integración de SIGESA Catamarca: Control centralizado de facturación, derivaciones y vigilancia estadística.
                    </p>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="relative w-full md:w-[400px]">
                        <input
                            type="text"
                            placeholder="Buscar por dirección o funcionario..."
                            className="w-full px-8 py-5 rounded-3xl bg-zinc-50 border border-zinc-100 shadow-sm focus:ring-4 focus:ring-[#0067b1]/5 focus:border-[#0067b1] outline-none transition-all font-bold text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            {/* Secretaria Filter Sidebar/Top */}
            <div className="flex flex-wrap gap-2 pb-4">
                {secretarias.map(sec => (
                    <button
                        key={sec}
                        onClick={() => setSelectedSec(sec)}
                        className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedSec === sec ? 'bg-[#002b49] text-white shadow-xl' : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200'}`}
                    >
                        {sec}
                    </button>
                ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 gap-12">
                {filtered.map((dir) => (
                    <div key={dir.id} className={`group p-8 md:p-10 rounded-[64px] border bg-white shadow-2xl transition-all relative overflow-hidden ${selectedDir === dir.id ? 'border-[#0067b1] ring-8 ring-[#0067b1]/5' : 'hover:border-[#f9b000]/50'}`}>
                        <div className={`w-3 h-32 rounded-full absolute left-0 top-10 ${dir.color === 'emerald' ? 'bg-emerald-500' : dir.color === 'amber' ? 'bg-amber-500' : dir.color === 'red' ? 'bg-red-500' : dir.color === 'sky' ? 'bg-sky-400' : 'bg-blue-600'}`} />

                        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                            <div className="flex-1 space-y-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{dir.id}</span>
                                        <span className="text-[10px] font-black text-[#0067b1] uppercase tracking-widest">• {dir.sec}</span>
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${dir.status === 'Activo' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100 animate-pulse'}`}>
                                            {dir.status}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-black text-zinc-900 group-hover:text-[#0067b1] transition-colors tracking-tight">{dir.name}</h2>
                                    <div className="flex items-center gap-4 pt-1">
                                        <div className="bg-sky-50 px-3 py-1 rounded-lg flex items-center gap-2">
                                            <span className="text-sky-600 text-[10px] font-bold">Módulo SIGESA:</span>
                                            <span className="text-sky-900 text-[10px] font-black uppercase tracking-widest">{dir.sigesa_mod}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-zinc-50">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">Responsable</p>
                                        <p className="text-sm font-black text-zinc-700">{dir.leader}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">Gestión SIGESA</p>
                                        <p className="text-sm font-mono font-bold text-sky-600">{dir.internal_ip}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">Incumbencia</p>
                                        <p className="text-xs font-bold text-zinc-500 italic">{dir.impact}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedDir(selectedDir === dir.id ? null : dir.id)}
                                className={`px-10 py-6 rounded-[32px] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${selectedDir === dir.id ? 'bg-[#002b49] text-white' : 'bg-zinc-900 text-white hover:bg-[#0067b1]'}`}
                            >
                                {selectedDir === dir.id ? 'Contraer' : 'Abrir SIGESA ↓'}
                            </button>
                        </div>

                        {/* Functional Structure */}
                        {selectedDir === dir.id && (
                            <div className="mt-12 pt-12 border-t-4 border-dashed border-zinc-50 animate-slide-in-top space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {dir.modules.map((mod, idx) => (
                                        <div key={idx} className="p-8 rounded-[48px] bg-zinc-50 border border-zinc-100 space-y-6 hover:bg-white hover:shadow-2xl transition-all border-l-8 border-l-[#0067b1]/20">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-black text-zinc-900 text-lg tracking-tight leading-tight">{mod.name}</h4>
                                                <span className="text-2xl opacity-20">⚙️</span>
                                            </div>
                                            <ul className="space-y-3">
                                                {mod.items.map((item, idy) => (
                                                    <li
                                                        key={idy}
                                                        onClick={() => handleOpenItem(dir, mod, item)}
                                                        className="flex items-center justify-between group/item cursor-pointer p-4 rounded-3xl hover:bg-[#0067b1]/5 transition-all"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center text-lg grayscale group-hover/item:grayscale-0 transition-all shadow-sm">
                                                                {item.includes("Facturación") ? "💰" : item.includes("HCE") ? "🩺" : "📋"}
                                                            </div>
                                                            <span className="text-sm font-black text-zinc-600 group-hover/item:text-[#0067b1] transition-colors">{item}</span>
                                                        </div>
                                                        <span className="text-[10px] font-black text-[#0067b1]/30 group-hover/item:text-[#0067b1] transition-all">GESTIÓN →</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* SIGESA MODAL */}
            {activeItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#002b49]/90 backdrop-blur-xl animate-fade-in">
                    <div className="bg-white w-full max-w-6xl rounded-[64px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-slide-in-top">
                        <div className="p-12 border-b flex justify-between items-start bg-zinc-50/80 backdrop-blur">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="bg-[#0067b1] text-white px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">SIGESA PRO V4.2</span>
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">{activeItem.dir} • {activeItem.mod}</p>
                                </div>
                                <h2 className="text-5xl font-black text-zinc-900 tracking-tighter">{activeItem.item}</h2>
                                <div className="flex items-center gap-3">
                                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Sincronización Ministerial Activa</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setActiveItem(null)}
                                className="w-16 h-16 rounded-[24px] bg-white border-2 border-zinc-100 text-zinc-400 hover:text-[#0067b1] hover:border-[#0067b1] flex items-center justify-center text-4xl shadow-xl transition-all"
                            >✕</button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-12 space-y-16">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                <div className="lg:col-span-2 p-10 rounded-[48px] bg-white border-2 border-zinc-50 shadow-sm space-y-8">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-black text-zinc-900 uppercase tracking-[0.2em] flex items-center gap-4">
                                            <span className="w-2 h-8 bg-[#0067b1] rounded-full"></span> Análisis Estadístico SIGESA
                                        </h3>
                                    </div>

                                    {activeItem.data?.stats ? (
                                        <div className="space-y-8">
                                            <div className="flex items-end gap-4 h-48 px-4">
                                                {activeItem.data.stats.values.map((val: number, i: number) => (
                                                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar">
                                                        <div
                                                            className="w-full bg-[#0067b1]/10 group-hover/bar:bg-gradient-to-t group-hover/bar:from-[#0067b1] group-hover/bar:to-sky-400 transition-all rounded-2xl relative shadow-inner"
                                                            style={{ height: `${(val / Math.max(...activeItem.data.stats.values)) * 100}%` }}
                                                        >
                                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-all shadow-xl">
                                                                {val}
                                                            </div>
                                                        </div>
                                                        <span className="text-[10px] font-black text-zinc-400 uppercase group-hover/bar:text-zinc-900 transition-colors">SEM {i + 1}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex justify-between items-center p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                                                <div className="space-y-1">
                                                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Indicador Clave</p>
                                                    <p className="text-sm font-black text-zinc-800">{activeItem.data.stats.label}</p>
                                                </div>
                                                <div className="text-right space-y-1">
                                                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Tendencia</p>
                                                    <p className="text-sm font-black text-emerald-600 flex items-center gap-2">{activeItem.data.stats.trend} ⏶</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-48 flex flex-col items-center justify-center border-4 border-dashed border-zinc-50 rounded-[48px] text-zinc-200">
                                            <span className="text-6xl mb-4">📊</span>
                                            <p className="font-black uppercase tracking-widest text-xs">Aguardando Sincronización de Datos</p>
                                        </div>
                                    )}
                                </div>

                                <div className="p-10 rounded-[48px] bg-[#002b49] text-white flex flex-col justify-between border-4 border-[#0067b1]/20">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-sky-400 uppercase tracking-[0.2em]">Acumulado SIGESA</p>
                                        <p className="text-7xl font-black tracking-tighter">{activeItem.data?.stats?.total || "---"}</p>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-sky-400 w-3/4 rounded-full"></div>
                                        </div>
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-relaxed">
                                            La información se actualiza automáticamente desde los nodos provinciales.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* PLANILLA SIGESA */}
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-black text-zinc-900 uppercase tracking-[0.2em] flex items-center gap-4">
                                        <span className="w-2 h-8 bg-[#f9b000] rounded-full"></span> Planilla de Registro SIGESA
                                    </h3>
                                    <div className="flex gap-4">
                                        <button className="px-6 py-3 bg-zinc-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#002b49] transition-all">Sincronizar SNVS</button>
                                        <button className="px-6 py-3 border-2 border-zinc-100 text-zinc-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-[#0067b1] transition-all">Excel 📥</button>
                                    </div>
                                </div>

                                <div className="rounded-[48px] border-2 border-zinc-50 overflow-hidden shadow-sm overflow-x-auto bg-white">
                                    <table className="w-full text-left text-sm border-collapse">
                                        <thead className="bg-zinc-50/50 border-b-2 border-zinc-50">
                                            <tr>
                                                {activeItem.data?.table?.[0] ? Object.keys(activeItem.data.table[0]).map((key) => (
                                                    <th key={key} className="px-8 py-6 font-black text-zinc-400 uppercase text-[10px] tracking-widest">{key}</th>
                                                )) : <th className="px-8 py-6 font-black text-zinc-500 uppercase text-[10px]">Información</th>}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-50">
                                            {activeItem.data?.table ? activeItem.data.table.map((row: any, i: number) => (
                                                <tr key={i} className="hover:bg-[#0067b1]/5 transition-colors group/row">
                                                    {Object.values(row).map((val: any, j) => (
                                                        <td key={j} className="px-8 py-6">
                                                            <span className={`font-black text-sm ${typeof val === 'string' && val.includes('$') ? 'text-emerald-600 font-mono' : 'text-zinc-700'}`}>
                                                                {val}
                                                            </span>
                                                        </td>
                                                    ))}
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td className="px-8 py-20 text-center text-zinc-300 font-black uppercase tracking-widest text-xs">No hay registros cargados en este nodo</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* SIGESA SMART ACTIONS */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t-2 border-zinc-50">
                                <button className="p-8 rounded-[40px] bg-[#0067b1]/5 hover:bg-[#0067b1] text-zinc-900 hover:text-white transition-all text-left space-y-2 group shadow-lg shadow-[#0067b1]/5">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Acción Propietaria</p>
                                    <p className="font-black text-lg group-hover:translate-x-2 transition-transform">Nueva Facturación</p>
                                </button>
                                <button className="p-8 rounded-[40px] bg-emerald-500/5 hover:bg-emerald-500 text-zinc-900 hover:text-white transition-all text-left space-y-2 group shadow-lg shadow-emerald-500/5">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Auditoría SIG</p>
                                    <p className="font-black text-lg group-hover:translate-x-2 transition-transform">Validar Evidencia</p>
                                </button>
                                <button className="p-8 rounded-[40px] bg-sky-500/5 hover:bg-sky-500 text-zinc-900 hover:text-white transition-all text-left space-y-2 group shadow-lg shadow-sky-500/5">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Conectividad</p>
                                    <p className="font-black text-lg group-hover:translate-x-2 transition-transform">Sincronizar Nodo</p>
                                </button>
                            </div>
                        </div>

                        <footer className="p-8 bg-zinc-950 text-white/50 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em]">
                            <div className="flex items-center gap-6">
                                <p>CERTIFICACIÓN ISO 27001</p>
                                <p>TERMINAL: CATA-SIG-092-A</p>
                            </div>
                            <p>© 2026 MINISTERIO DE SALUD CATAMARCA</p>
                        </footer>
                    </div>
                </div>
            )}

            {/* Footer Branding Upgrade */}
            <div className="mt-24 p-16 rounded-[80px] bg-gradient-to-br from-[#002b49] via-[#00477a] to-[#0067b1] text-white flex flex-col md:flex-row items-center justify-between gap-12 shadow-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-sky-400 opacity-10 rounded-full blur-[120px] -mr-32 -mt-32" />
                <div className="relative z-10 flex items-center gap-10">
                    <div className="w-32 h-32 rounded-[40px] bg-white/10 backdrop-blur-md flex items-center justify-center text-6xl shadow-inner rotate-3">🏢</div>
                    <div className="space-y-4">
                        <h3 className="text-5xl font-black tracking-tighter">SIGESA PRO INTEGRAL</h3>
                        <p className="text-sky-100/60 font-bold max-w-2xl text-lg leading-relaxed italic">
                            "Unificando la salud pública de Catamarca bajo un estándar tecnológico de excelencia internacional."
                        </p>
                    </div>
                </div>
                <div className="flex flex-col gap-4 relative z-10">
                    <button className="px-12 py-8 bg-[#f9b000] text-[#002b49] rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-[#0067b1] transition-all shadow-2xl active:scale-95 group">
                        Generar Reporte Ministerial <span className="inline-block group-hover:translate-x-2 transition-transform ml-2">→</span>
                    </button>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest text-center">Exportación segura AES-256</p>
                </div>
            </div>
        </div>
    );
}
