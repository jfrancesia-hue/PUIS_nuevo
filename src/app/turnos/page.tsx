"use client";

import { useState } from "react";

export default function Turnos() {
    const [view, setView] = useState<"lista" | "calendario">("lista");
    const [selectedSpecialty, setSelectedSpecialty] = useState("Todas las especialidades");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTurno, setNewTurno] = useState({ patient: "", specialty: "Clínica Médica", doctor: "", time: "09:00" });

    const initialTurnos = [
        { id: 1, time: "08:00", patient: "Marcos Diaz", specialty: "Clínica Médica", status: "Llegó", color: "bg-emerald-500", doctor: "Dr. Rodrigo" },
        { id: 2, time: "08:30", patient: "Lucía Mendez", specialty: "Cardiología", status: "Atendiendo", color: "bg-accent", doctor: "Dra. Elena Sanchez" },
        { id: 3, time: "09:00", patient: "Jorge Luna", specialty: "Pediatría", status: "Confirmado", color: "bg-[#0067b1]", doctor: "Dr. Vazquez" },
        { id: 4, time: "09:15", patient: "Silvia Doe", specialty: "Control Post-Op", status: "Confirmado", color: "bg-[#0067b1]", doctor: "Dr. Rodrigo" },
        { id: 5, time: "10:00", patient: "Raul Gomez", specialty: "Dermatología", status: "Pendiente", color: "bg-zinc-400", doctor: "Dra. Sosa" },
        { id: 6, time: "10:30", patient: "Marta Rueda", specialty: "Ginecología", status: "Cancelado", color: "bg-red-500", doctor: "Dra. Gomez" },
        { id: 7, time: "11:00", patient: "Andrés Soler", specialty: "Traumatología", status: "Confirmado", color: "bg-[#0067b1]", doctor: "Dr. Ruiz" },
    ];

    const [turnos, setTurnos] = useState(initialTurnos);

    const filteredTurnos = turnos.filter(t =>
        selectedSpecialty === "Todas las especialidades" || t.specialty === selectedSpecialty
    );

    const handleAddTurno = (e: React.FormEvent) => {
        e.preventDefault();
        const id = turnos.length + 1;
        setTurnos([...turnos, { ...newTurno, id, status: "Confirmado", color: "bg-[#0067b1]" }]);
        setIsModalOpen(false);
        setNewTurno({ patient: "", specialty: "Clínica Médica", doctor: "", time: "09:00" });
    };

    const updateStatus = (id: number, newStatus: string) => {
        const colors: Record<string, string> = {
            "Confirmado": "bg-[#0067b1]",
            "Atendiendo": "bg-accent",
            "Finalizado": "bg-emerald-500",
            "Cancelado": "bg-red-500",
            "Llegó": "bg-emerald-500"
        };
        setTurnos(turnos.map(t => t.id === id ? { ...t, status: newStatus, color: colors[newStatus] || "bg-zinc-400" } : t));
    };

    return (
        <div className="space-y-8 animate-fade-in font-outfit pb-20">
            {/* Header */}
            <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                        Gestión de <span className="text-[#0067b1]">Turnos</span>
                    </h1>
                    <p className="text-zinc-500 font-bold">Administración de agenda médica y programación de citas ministeriales.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-white dark:bg-zinc-900 border rounded-2xl font-black text-xs shadow-sm">
                        📅 Hoy: 30 Ene 2026
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#0067b1] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#003b6d] hover:shadow-xl transition-all active:scale-95"
                    >
                        + Agendar Turno
                    </button>
                </div>
            </section>

            {/* Calendar View Toggle */}
            <div className="flex gap-2 p-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-[20px] w-fit shadow-inner">
                <button
                    onClick={() => setView("lista")}
                    className={`px-6 py-2 rounded-[14px] text-xs font-black transition-all ${view === "lista" ? "bg-white dark:bg-zinc-800 shadow-md text-zinc-900" : "text-zinc-400 hover:text-zinc-600"}`}
                >
                    Lista
                </button>
                <button
                    onClick={() => setView("calendario")}
                    className={`px-6 py-2 rounded-[14px] text-xs font-black transition-all ${view === "calendario" ? "bg-white dark:bg-zinc-800 shadow-md text-zinc-900" : "text-zinc-400 hover:text-zinc-600"}`}
                >
                    Calendario
                </button>
            </div>

            {/* Dashboard Area */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Filters/Sidebar */}
                <div className="xl:col-span-1 space-y-6">
                    <div className="p-8 rounded-[40px] bg-white dark:bg-zinc-900/40 border-2 border-zinc-50 dark:border-zinc-800 space-y-8 shadow-xl">
                        <h3 className="font-black text-zinc-900 dark:text-zinc-50 text-sm uppercase tracking-widest border-b-2 border-dashed pb-4">Filtros Avanzados</h3>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-zinc-400 block mb-3 uppercase tracking-widest">Especialidad Médica</label>
                                <select
                                    className="w-full p-4 rounded-2xl border-2 border-zinc-50 bg-zinc-50 dark:bg-zinc-800 text-sm font-bold outline-none focus:ring-4 focus:ring-[#0067b1]/5 focus:border-[#0067b1] transition-all"
                                    value={selectedSpecialty}
                                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                                >
                                    <option>Todas las especialidades</option>
                                    <option>Clínica Médica</option>
                                    <option>Cardiología</option>
                                    <option>Pediatría</option>
                                    <option>Dermatología</option>
                                    <option>Ginecología</option>
                                    <option>Traumatología</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-zinc-400 block mb-3 uppercase tracking-widest">Estado del Turno</label>
                                <div className="space-y-3">
                                    {['Confirmados', 'Pendientes', 'Cancelados'].map((status) => (
                                        <label key={status} className="flex items-center gap-3 text-sm font-bold text-zinc-600 cursor-pointer group">
                                            <input type="checkbox" defaultChecked className="w-5 h-5 rounded-lg border-2 border-zinc-200 accent-[#0067b1] transition-all" />
                                            <span className="group-hover:text-zinc-900 transition-colors uppercase text-[10px] tracking-widest">{status}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 rounded-[40px] bg-emerald-500/5 border-2 border-emerald-500/20 shadow-lg group">
                        <h4 className="font-black text-emerald-600 dark:text-emerald-400 text-[10px] uppercase tracking-widest">Disponibilidad de Red</h4>
                        <div className="mt-6 flex items-center justify-between">
                            <span className="text-5xl font-black text-emerald-600 tracking-tighter">82%</span>
                            <div className="w-20 h-20 rounded-full border-[6px] border-emerald-500/10 border-t-emerald-500 animate-spin-slow shadow-inner" />
                        </div>
                        <p className="text-xs font-bold text-emerald-600/60 mt-4 italic">Capacidad operativa óptima para la zona metropolitana.</p>
                    </div>
                </div>

                {/* Turnos View */}
                <div className="xl:col-span-3 space-y-6">
                    {view === "lista" ? (
                        <div className="border-2 border-zinc-50 rounded-[48px] overflow-hidden bg-white dark:bg-zinc-900/40 divide-y-2 divide-zinc-50 shadow-2xl">
                            {filteredTurnos.map((turno) => (
                                <div key={turno.id} className="flex flex-col md:flex-row md:items-center justify-between p-8 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-all group">
                                    <div className="flex items-center gap-8">
                                        <div className="text-3xl font-black font-outfit text-zinc-300 group-hover:text-[#0067b1] transition-all duration-500">{turno.time}</div>
                                        <div className="h-14 w-[3px] bg-zinc-100 dark:bg-zinc-800 rounded-full" />
                                        <div className="space-y-1">
                                            <h4 className="font-black text-xl text-zinc-900 dark:text-zinc-50 tracking-tight">{turno.patient}</h4>
                                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{turno.specialty} • <span className="text-[#0067b1] font-black">{turno.doctor}</span></p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 mt-6 md:mt-0">
                                        <div className="relative group/menu">
                                            <button className={`px-5 py-2 rounded-2xl text-[9px] font-black text-white ${turno.color} uppercase tracking-[0.2em] cursor-pointer hover:scale-105 transition-all flex items-center gap-3 shadow-md`}>
                                                {turno.status}
                                                <span className="text-[7px] opacity-60">▼</span>
                                            </button>

                                            <div className="absolute top-full right-0 mt-3 w-48 bg-white dark:bg-zinc-900 border-2 border-zinc-50 rounded-[28px] shadow-2xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20 overflow-hidden transform group-hover/menu:translate-y-0 translate-y-2">
                                                {['Confirmado', 'Atendiendo', 'Finalizado', 'Cancelado'].map((status) => (
                                                    <button
                                                        key={status}
                                                        onClick={() => updateStatus(turno.id, status)}
                                                        className="w-full text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest hover:bg-[#0067b1] hover:text-white transition-all border-b last:border-0 border-zinc-50"
                                                    >
                                                        {status}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button className="px-8 py-3.5 rounded-[20px] text-[10px] font-black bg-[#0067b1] text-white shadow-xl hover:bg-[#004b8d] hover:-translate-y-1 transition-all active:scale-95 uppercase tracking-widest">Atender</button>
                                            <button className="w-12 h-12 rounded-[20px] border-2 border-zinc-50 hover:bg-zinc-100 transition-all flex items-center justify-center text-zinc-400 text-xl">
                                                ⋮
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filteredTurnos.length === 0 && (
                                <div className="p-20 text-center space-y-4">
                                    <div className="text-6xl opacity-20">📅</div>
                                    <p className="font-black text-zinc-400 uppercase tracking-widest">No hay turnos agendados para esta especialidad</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-10 border-2 border-zinc-50 rounded-[48px] bg-white shadow-2xl text-center space-y-10">
                            <h3 className="text-2xl font-black text-zinc-900 tracking-tighter">Calendario Interactivo SIGESA</h3>
                            <div className="grid grid-cols-7 gap-4">
                                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
                                    <div key={d} className="py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b-2 border-zinc-50">{d}</div>
                                ))}
                                {Array.from({ length: 31 }).map((_, i) => (
                                    <div key={i} className={`aspect-square p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${i + 1 === 30 ? 'bg-[#0067b1] border-[#0067b1] text-white shadow-xl' : 'bg-zinc-50 border-zinc-50 hover:border-[#0067b1] hover:bg-white'}`}>
                                        <span className="text-sm font-black">{i + 1}</span>
                                        {i + 1 === 15 && <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>}
                                        {i + 1 === 30 && <span className="text-[7px] font-black uppercase">HOY</span>}
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs font-bold text-zinc-400 italic font-mono uppercase tracking-widest opacity-60">Sincronizado con Datacenter Provincial • AES-256</p>
                        </div>
                    )}

                    <div className="flex justify-center">
                        <button className="px-10 py-5 rounded-[24px] border-2 border-zinc-50 text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] hover:text-[#0067b1] hover:border-[#0067b1]/30 transition-all">Ver Historial Completo</button>
                    </div>
                </div>
            </div>

            {/* NEW TURNO MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#002b49]/60 backdrop-blur-md animate-fade-in">
                    <div className="bg-white dark:bg-zinc-900 w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden animate-slide-in-top border-4 border-[#0067b1]/10">
                        <div className="p-10 border-b-2 border-dashed border-zinc-100 flex justify-between items-center">
                            <h2 className="text-3xl font-black text-[#0067b1] tracking-tighter uppercase">Agendar <span className="text-zinc-300">Cita</span></h2>
                            <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 rounded-2xl bg-zinc-50 text-zinc-400 hover:text-zinc-900 text-3xl transition-all">✕</button>
                        </div>
                        <form onSubmit={handleAddTurno} className="p-10 space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Nombre del Paciente</label>
                                <input
                                    required
                                    className="w-full p-5 rounded-3xl bg-zinc-50 border-2 border-zinc-50 outline-none focus:border-[#0067b1] font-bold text-sm transition-all"
                                    placeholder="Ej: Juan Pérez"
                                    value={newTurno.patient}
                                    onChange={(e) => setNewTurno({ ...newTurno, patient: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Especialidad</label>
                                    <select
                                        className="w-full p-5 rounded-3xl bg-zinc-50 border-2 border-zinc-50 outline-none focus:border-[#0067b1] font-bold text-sm transition-all"
                                        value={newTurno.specialty}
                                        onChange={(e) => setNewTurno({ ...newTurno, specialty: e.target.value })}
                                    >
                                        <option>Clínica Médica</option>
                                        <option>Cardiología</option>
                                        <option>Pediatría</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Horario</label>
                                    <input
                                        type="time"
                                        className="w-full p-5 rounded-3xl bg-zinc-50 border-2 border-zinc-50 outline-none focus:border-[#0067b1] font-bold text-sm transition-all"
                                        value={newTurno.time}
                                        onChange={(e) => setNewTurno({ ...newTurno, time: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-6 rounded-[32px] bg-[#0067b1] text-white font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:bg-[#003b6d] transition-all transform hover:-translate-y-1">Confirmar Agenda</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
