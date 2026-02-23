"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function FichaUnificada() {
    const searchParams = useSearchParams();
    const personaId = searchParams.get("id");

    const [activeTab, setActiveTab] = useState("Cronología");
    const [isNoteSaved, setIsNoteSaved] = useState(false);
    const [showWhatsApp, setShowWhatsApp] = useState(false);
    const [loading, setLoading] = useState(true);
    const [patient, setPatient] = useState<any>(null);
    const [showAuditModal, setShowAuditModal] = useState(true);
    const [auditReason, setAuditReason] = useState("");
    const [auditError, setAuditError] = useState(false);

    useEffect(() => {
        if (!personaId || !showAuditModal) {
            if (personaId) fetchPatient();
        }
    }, [personaId, showAuditModal]);

    const fetchPatient = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/personas/${personaId}`);
            const data = await res.json();
            setPatient(data);
        } catch (error) {
            console.error("Fetch patient error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmAudit = async () => {
        if (auditReason.length < 5) {
            setAuditError(true);
            return;
        }

        try {
            await fetch('/api/audit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'VIEW_PERSONA_RECORD',
                    entity: 'personas',
                    entity_id: personaId,
                    motivo: auditReason
                })
            });
            setShowAuditModal(false);
        } catch (error) {
            console.error("Audit log error:", error);
        }
    };

    if (loading && !showAuditModal) {
        return (
            <div className="min-h-screen flex items-center justify-center font-outfit">
                <div className="flex flex-col items-center gap-6 animate-pulse">
                    <div className="w-16 h-16 rounded-full border-4 border-[#0067b1]/30 border-t-[#0067b1] animate-spin" />
                    <p className="text-[#0067b1] text-xs font-black uppercase tracking-widest">Recuperando Historial Digital...</p>
                </div>
            </div>
        );
    }

    if (!patient && !loading && !showAuditModal) {
        return (
            <div className="text-center py-20 font-outfit">
                <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">No se encontró el paciente solicitado</p>
            </div>
        );
    }

    // Merge real data into layout...
    const patientData = patient ? {
        name: `${patient.nombre} ${patient.apellido}`,
        dni: patient.dni,
        age: patient.fecha_nac ? `${new Date().getFullYear() - new Date(patient.fecha_nac).getFullYear()} años` : "N/A",
        status: "Registrado",
        allergies: "No registradas",
        center: "Hospital Provincial",
        obs: ["Registro oficial del Ministerio de Salud."]
    } : null;

    const timeline = patient ? [
        ...(patient.turnos || []).map((t: any) => ({
            date: new Date(t.fecha).toLocaleDateString(),
            title: `Turno: ${t.especialidad}`,
            doctor: t.profesional,
            clinic: "Centro de Salud",
            color: "bg-[#0067b1]",
            details: t.notas || `Atención programada - Estado: ${t.estado}`
        })),
        ...(patient.reclamos || []).map((r: any) => ({
            date: new Date(r.created_at).toLocaleDateString(),
            title: `Reclamo: ${r.categoria}`,
            doctor: "Sistema",
            clinic: "Atención Ciudadana",
            color: "bg-red-500",
            details: r.descripcion || `Urgencia: ${r.urgencia} - Estado: ${r.estado}`
        }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : [];

    return (
        <div className="space-y-8 animate-fade-in font-outfit pb-20">
            {/* AUDIT MODAL */}
            {showAuditModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#002b49]/90 backdrop-blur-xl animate-fade-in">
                    <div className="bg-white w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden border-8 border-[#0067b1]/10">
                        <div className="p-10 bg-[#0067b1] text-white space-y-2">
                            <h3 className="text-3xl font-black tracking-tighter uppercase">Protocolo de Acceso</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">Ley de Protección de Datos Personales 25.326</p>
                        </div>
                        <div className="p-10 space-y-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-4">Motivo de Consulta (Obligatorio)</label>
                                <textarea
                                    value={auditReason}
                                    onChange={(e) => { setAuditReason(e.target.value); setAuditError(false); }}
                                    placeholder="Ej: Verificación de turnos pendientes, auditoría de reclamos, etc..."
                                    className={`w-full h-32 px-8 py-6 rounded-3xl bg-zinc-50 border-2 ${auditError ? 'border-red-500 bg-red-50' : 'border-zinc-100'} focus:border-[#0067b1] outline-none transition-all font-bold text-lg resize-none`}
                                />
                                {auditError && <p className="text-[9px] font-black text-red-500 uppercase tracking-widest text-center mt-2 animate-pulse">Debe ingresar un motivo válido para continuar</p>}
                            </div>
                            <div className="p-6 rounded-2xl bg-zinc-50 flex items-center gap-4 border border-zinc-100">
                                <span className="text-2xlgrayscale">👁️</span>
                                <p className="text-[9px] font-bold text-zinc-500 leading-relaxed uppercase tracking-widest">Su identidad y este motivo quedarán registrados permanentemente en el Nodo de Auditoría Central.</p>
                            </div>
                            <button
                                onClick={handleConfirmAudit}
                                className="w-full py-6 rounded-3xl bg-[#0067b1] text-white font-black uppercase tracking-[0.3em] text-xs shadow-xl hover:bg-[#005694] transition-all transform active:scale-95"
                            >Validar y Abrir Ficha</button>
                        </div>
                    </div>
                </div>
            )}

            {patientData && (
                <>
                    {/* Header */}
                    <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                                Ficha <span className="text-[#0067b1]">Unificada</span>
                            </h1>
                            <p className="text-zinc-500 font-bold">Consulta integral de historias clínicas digitales del Ministerio de Salud.</p>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Left Sidebar */}
                        <div className="lg:col-span-1 space-y-8">
                            {/* Profile Card */}
                            <div className="p-10 rounded-[56px] bg-white border-2 border-zinc-50 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0067b1]/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className="w-32 h-32 rounded-[48px] bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-5xl mb-6 border-4 border-white dark:border-zinc-800 shadow-2xl group-hover:rotate-6 transition-all">
                                        👤
                                    </div>
                                    <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter uppercase">{patientData.name}</h2>
                                    <p className="text-xs font-black text-[#0067b1] tracking-[0.2em] mt-2">DNI: {patientData.dni}</p>

                                    <div className="mt-10 w-full space-y-4">
                                        {[
                                            { label: "Edad", val: patientData.age },
                                            { label: "Estado", val: patientData.status, color: "text-emerald-600" },
                                            { label: "Centro", val: patientData.center }
                                        ].map((item, i) => (
                                            <div key={i} className="flex justify-between text-[10px] py-4 border-b-2 border-dashed border-zinc-50">
                                                <span className="font-black text-zinc-400 uppercase tracking-widest">{item.label}</span>
                                                <span className={`font-black uppercase tracking-widest ${item.color || "text-zinc-700"}`}>{item.val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="p-10 rounded-[48px] border-2 border-zinc-50 bg-white shadow-2xl space-y-8">
                                <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">Panel de Acciones</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { icon: "📢", label: "Reclamo", color: "hover:bg-[#0067b1]" },
                                        { icon: "🚑", label: "Derivación", color: "hover:bg-emerald-500" },
                                        { icon: "📅", label: "Dar Turno", color: "hover:bg-sky-500" },
                                        { icon: "🚨", label: "Alerta", color: "hover:bg-red-500" }
                                    ].map((act, i) => (
                                        <button key={i} className={`flex flex-col items-center justify-center p-6 rounded-[32px] bg-zinc-50 group border-2 border-transparent transition-all ${act.color} hover:text-white hover:shadow-2xl shadow-sm`}>
                                            <span className="text-3xl mb-2 group-hover:scale-125 transition-transform">{act.icon}</span>
                                            <span className="text-[9px] font-black uppercase tracking-widest">{act.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Content */}
                        <div className="lg:col-span-2 space-y-10">
                            {/* Navigation Tabs */}
                            <div className="flex items-center gap-10 pb-4 border-b-4 border-zinc-50 overflow-x-auto">
                                {['Cronología', 'Estudios', 'Vacunas'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`text-[11px] font-black uppercase tracking-[0.3em] pb-4 transition-all whitespace-nowrap ${activeTab === tab ? "border-b-4 border-[#0067b1] text-[#0067b1] translate-y-1" : "text-zinc-400 hover:text-zinc-600"}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Timeline */}
                            {activeTab === 'Cronología' ? (
                                <div className="space-y-10 relative before:absolute before:left-8 before:top-4 before:bottom-4 before:w-1 before:bg-zinc-100 dark:before:bg-zinc-800 before:rounded-full">
                                    {timeline.length > 0 ? timeline.map((event, i) => (
                                        <div key={i} className="flex gap-10 relative pl-16 group">
                                            <div className={`absolute left-0 top-2 w-16 h-16 rounded-[28px] ${event.color} border-8 border-white dark:border-zinc-950 flex items-center justify-center text-white text-[10px] font-black z-10 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all shadow-xl`}>
                                                {i === 0 ? 'NEW' : 'OK'}
                                            </div>
                                            <div className="flex-1 p-10 rounded-[48px] border-2 bg-white dark:bg-zinc-900/40 hover:border-[#0067b1] transition-all shadow-xl group/card">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="space-y-1">
                                                        <h4 className="font-black text-2xl text-zinc-900 dark:text-zinc-50 tracking-tight group-hover/card:text-[#0067b1] transition-colors">{event.title}</h4>
                                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{event.date}</p>
                                                    </div>
                                                    <span className="px-4 py-2 bg-zinc-50 rounded-xl text-[9px] font-black uppercase tracking-widest border border-zinc-100 shadow-inner">Historico</span>
                                                </div>
                                                <p className="text-zinc-500 font-bold text-sm italic mb-6 leading-relaxed">
                                                    "{event.details}"
                                                </p>
                                                <div className="flex items-center gap-8 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-t-2 border-dashed border-zinc-50 pt-6">
                                                    <span className="flex items-center gap-2 group-hover/card:text-zinc-800 transition-colors">👤 {event.doctor}</span>
                                                    <span className="flex items-center gap-2 group-hover/card:text-zinc-800 transition-colors">📍 {event.clinic}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="p-20 text-center bg-white border-4 border-dashed border-zinc-50 rounded-[64px] space-y-4">
                                            <span className="text-7xl opacity-20">📂</span>
                                            <p className="font-black text-zinc-400 uppercase tracking-widest">No hay historial clínico disponible</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="p-20 text-center bg-white border-4 border-dashed border-zinc-50 rounded-[64px] space-y-4">
                                    <span className="text-7xl opacity-20">📂</span>
                                    <p className="font-black text-zinc-400 uppercase tracking-widest">No hay registros cargados en esta categoría</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
