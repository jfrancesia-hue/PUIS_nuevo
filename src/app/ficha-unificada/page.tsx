"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Persona, Turno, Documento, Profile } from "@/types";

export default function FichaUnificada() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const personaId = searchParams.get("personaId") || searchParams.get("id");

    const [activeTab, setActiveTab] = useState("Cronología");
    const [isNoteSaved, setIsNoteSaved] = useState(false);
    const [showWhatsApp, setShowWhatsApp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [patient, setPatient] = useState<Persona | null>(null);
    const [showAuditModal, setShowAuditModal] = useState(false);
    const [auditReason, setAuditReason] = useState("");
    const [auditError, setAuditError] = useState(false);
    const [isAuditing, setIsAuditing] = useState(false);
    const [auditApiError, setAuditApiError] = useState("");
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<Profile | null>(null);

    // Documentos State
    const [documents, setDocuments] = useState<Documento[]>([]);
    const [loadingDocs, setLoadingDocs] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadTitle, setUploadTitle] = useState("");
    const [uploadType, setUploadType] = useState("dni");
    const [uploadFile, setUploadFile] = useState<File | null>(null);

    // Turnos State
    const [turns, setTurns] = useState<Turno[]>([]);
    const [loadingTurns, setLoadingTurns] = useState(false);
    const [creatingTurn, setCreatingTurn] = useState(false);
    const [newTurnDate, setNewTurnDate] = useState("");
    const [newTurnSpecialty, setNewTurnSpecialty] = useState("");
    const [newTurnNote, setNewTurnNote] = useState("");

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            // Fetch User
            const resAuth = await fetch('/api/auth/me');
            const dataAuth = await resAuth.json();
            if (!dataAuth.ok || !dataAuth.user) {
                router.push("/login");
                return;
            }
            setUser(dataAuth.user);

            // Fetch Profile (with Role)
            const resProf = await fetch('/api/profile/me');
            const dataProf = await resProf.json();
            if (dataProf.ok) {
                setProfile(dataProf.profile);
            }
        } catch (err) {
            router.push("/login");
        }
    };

    useEffect(() => {
        if (!personaId) {
            setShowAuditModal(false);
            setLoading(false);
            setPatient(null);
            setDocuments([]);
        } else {
            setShowAuditModal(true);
            setPatient(null);
            setDocuments([]);
            localStorage.setItem('puis_last_persona_id', personaId);
        }
    }, [personaId]);

    useEffect(() => {
        if (personaId && !showAuditModal) {
            fetchPatient();
            fetchDocuments();
            fetchTurns();
        }
    }, [personaId, showAuditModal]);

    const fetchTurns = async () => {
        if (!personaId) return;
        setLoadingTurns(true);
        try {
            const res = await fetch(`/api/personas/${personaId}/turnos`);
            const data = await res.json();
            if (data.ok) setTurns(data.items || []);
        } catch (err) {
            console.error("Fetch turns error:", err);
        } finally {
            setLoadingTurns(false);
        }
    };

    const handleCreateTurn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTurnDate || !newTurnSpecialty || !personaId) return;

        setCreatingTurn(true);
        try {
            const res = await fetch(`/api/personas/${personaId}/turnos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fecha_hora: newTurnDate,
                    especialidad: newTurnSpecialty,
                    nota: newTurnNote
                })
            });
            const data = await res.json();
            if (res.ok) {
                setNewTurnDate("");
                setNewTurnSpecialty("");
                setNewTurnNote("");
                fetchTurns();
                alert("Turno programado con éxito");
            } else {
                alert("Error: " + data.error);
            }
        } catch (err) {
            alert("Error al conectar con el servidor");
        } finally {
            setCreatingTurn(false);
        }
    };

    const handleUpdateTurnStatus = async (turnId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/turnos/${turnId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: newStatus })
            });
            if (res.ok) {
                fetchTurns();
            } else {
                const data = await res.json();
                alert("Error: " + data.error);
            }
        } catch (err) {
            alert("Error al actualizar estado");
        }
    };

    const fetchPatient = async () => {
        setLoading(true);
        try {
            console.log(`[DEV] Fetching patient: /api/personas/${personaId}`);
            const res = await fetch(`/api/personas/${personaId}`);
            if (!res.ok) throw new Error(`Status: ${res.status}`);
            const data = await res.json();
            if (data.ok) {
                setPatient(data.item);
            }
        } catch (error) {
            console.error("[DEV] Fetch patient error:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDocuments = async () => {
        if (!personaId) return;
        setLoadingDocs(true);
        try {
            console.log(`[DEV] Fetching documents: /api/personas/${personaId}/documentos`);
            const res = await fetch(`/api/personas/${personaId}/documentos`);
            if (!res.ok) throw new Error(`Status: ${res.status}`);
            const data = await res.json();
            if (data.ok && data.items) {
                setDocuments(data.items);
                localStorage.setItem('puis_step_docs_listed', 'true');
            }
        } catch (error) {
            console.error("[DEV] Fetch docs error:", error);
        } finally {
            setLoadingDocs(false);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadFile || !uploadTitle || !personaId) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', uploadFile);
        formData.append('persona_id', personaId);
        formData.append('titulo', uploadTitle);
        formData.append('tipo', uploadType);

        try {
            const res = await fetch('/api/documentos/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                setUploadTitle("");
                setUploadFile(null);
                fetchDocuments();
                localStorage.setItem('puis_step_docs_uploaded', 'true');
                alert("Documento subido con éxito");
            } else {
                alert("Error: " + (data.error || "Desconocido"));
            }
        } catch (error) {
            alert("Error al conectar con el servidor");
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = async (docId: string) => {
        try {
            const res = await fetch(`/api/documentos/${docId}/download`);
            const data = await res.json();
            if (data.signedUrl) {
                window.open(data.signedUrl, '_blank');
                localStorage.setItem('puis_step_docs_downloaded', 'true');
            } else {
                alert("No se pudo obtener el enlace de descarga");
            }
        } catch (error) {
            alert("Error al descargar");
        }
    };

    const handleConfirmAudit = async () => {
        if (auditReason.trim().length < 5) {
            setAuditError(true);
            return;
        }

        setIsAuditing(true);
        setAuditApiError("");

        try {
            console.log(`[DEV] Sending audit log for: ${personaId}`);
            const res = await fetch('/api/audit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    accion: 'VIEW_PERSONA_RECORD',
                    entity: 'personas',
                    entity_id: personaId,
                    motivo: auditReason
                })
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || `Error servidor: ${res.status}`);
            }

            setShowAuditModal(false);
        } catch (error: any) {
            console.error("[DEV] Audit log error:", error);
            setAuditApiError(error.message || "Error al validar identidad. Intente nuevamente.");
        } finally {
            setIsAuditing(false);
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
                <div className="mt-6">
                    <button
                        onClick={() => router.push('/ficha-unificada?id=8903f85b-c12a-403d-a9fa-8bc709f077c8')}
                        className="px-6 py-3 bg-[#0067b1] text-white rounded-xl font-bold uppercase text-[10px] tracking-widest"
                    >Cargar Registro Sugerido</button>
                </div>
            </div>
        );
    }

    // Merge real data into layout...
    const patientData = patient ? {
        name: `${patient.nombre} ${patient.apellido}`,
        dni: patient.dni,
        age: patient.fecha_nacimiento ? `${new Date().getFullYear() - new Date(patient.fecha_nacimiento).getFullYear()} años` : "N/A",
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
        <div className="space-y-10 animate-fade-in font-outfit pb-20 max-w-6xl mx-auto px-4 pt-4">
            {/* AUDIT MODAL */}
            {showAuditModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#002b49]/95 backdrop-blur-2xl animate-fade-in">
                    <div className="bg-white w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden border-8 border-[#0067b1]/10 transform scale-100 transition-transform">
                        <div className="p-10 bg-[#0067b1] text-white space-y-2 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                            <h3 className="text-3xl font-black tracking-tighter uppercase relative z-10">Protocolo de Acceso</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 italic relative z-10">Seguridad Ministerial • Ley 25.326</p>
                        </div>
                        <div className="p-10 space-y-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-4">Motivo de Consulta Obligatorio</label>
                                <textarea
                                    value={auditReason}
                                    onChange={(e) => { setAuditReason(e.target.value); setAuditError(false); setAuditApiError(""); }}
                                    placeholder="Ej: Auditoría de documentación para derivación a especialista..."
                                    className={`w-full h-32 px-8 py-6 rounded-3xl bg-white border-2 ${auditError || auditApiError ? 'border-red-500 bg-red-50' : 'border-zinc-100'} focus:border-[#0067b1] outline-none transition-all font-bold text-lg text-slate-900 placeholder:text-slate-400 resize-none shadow-inner`}
                                />
                                {(auditError || auditApiError) && (
                                    <p className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-4 animate-bounce">
                                        {auditApiError || "Ingrese un motivo válido (mín. 5 caracteres)"}
                                    </p>
                                )}
                            </div>
                            <div className="p-6 rounded-3xl bg-zinc-50 flex items-center gap-4 border border-zinc-100 shadow-sm">
                                <span className="text-2xlgrayscale">👁️</span>
                                <p className="text-[10px] font-bold text-zinc-500 leading-relaxed uppercase tracking-widest">
                                    Esta consulta será registrada con su usuario <span className="text-[#0067b1] font-black">{user?.email || 'N/A'}</span>.
                                </p>
                            </div>
                            <button
                                onClick={handleConfirmAudit}
                                disabled={isAuditing}
                                className={`w-full py-6 rounded-3xl bg-[#0067b1] text-white font-black uppercase tracking-[0.3em] text-xs shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-3 ${isAuditing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#005694]'}`}
                            >
                                {isAuditing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Validando...
                                    </>
                                ) : (
                                    "Validar Identidad y Abrir ➔"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header / Search Area */}
            <section className="bg-white rounded-[40px] p-10 border border-zinc-100 shadow-2xl shadow-zinc-200/50 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-zinc-900 leading-none">
                            FICHA <span className="text-[#0067b1]">UNIFICADA</span>
                        </h1>
                        <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-3">Repositorio Central de Salud • Nodo Catamarca</p>
                    </div>
                    <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Sesión Activa
                    </div>
                </div>

                <div className="h-px bg-zinc-100 w-full" />

                <div className="flex flex-col md:flex-row items-end gap-6 bg-zinc-50 p-6 rounded-3xl border border-zinc-100">
                    <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-4">ID de Persona / DNI</label>
                        <input
                            type="text"
                            defaultValue={personaId || "8903f85b-c12a-403d-a9fa-8bc709f077c8"}
                            id="search-input"
                            className="w-full px-8 py-5 rounded-[24px] bg-white border-2 border-zinc-100 focus:border-[#0067b1] outline-none font-bold text-xl shadow-sm transition-all"
                            placeholder="Ingrese ID o DNI..."
                        />
                    </div>
                    <button
                        onClick={() => {
                            const val = (document.getElementById('search-input') as HTMLInputElement).value;
                            if (val) router.push(`/ficha-unificada?id=${val}`);
                        }}
                        className="px-10 py-5 rounded-[24px] bg-[#0067b1] text-white font-black uppercase tracking-widest text-xs shadow-xl hover:bg-[#005694] transition-all transform active:scale-95 h-[64px]"
                    >
                        Abrir Ficha 🔍
                    </button>
                    <button
                        onClick={() => router.push('/ficha-unificada?id=8903f85b-c12a-403d-a9fa-8bc709f077c8')}
                        className="px-6 py-5 rounded-[24px] bg-zinc-200 text-zinc-600 font-black uppercase tracking-widest text-[9px] hover:bg-zinc-300 transition-all h-[64px]"
                    >
                        Registro Sugerido
                    </button>
                </div>
            </section>

            {patientData ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                    {/* Left Panel: Patient Summary */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-[40px] p-8 border border-zinc-100 shadow-xl relative overflow-hidden text-center">
                            <div className="w-32 h-32 rounded-[32px] bg-zinc-50 mx-auto flex items-center justify-center text-5xl mb-6 shadow-inner border border-zinc-100">
                                👤
                            </div>
                            <h2 className="text-2xl font-black text-zinc-900 tracking-tighter uppercase">{patientData.name}</h2>
                            <p className="text-[10px] font-black text-[#0067b1] tracking-[0.2em] mt-2 border-y py-2 border-zinc-50">DNI: {patientData.dni}</p>

                            <div className="mt-8 space-y-4 text-left">
                                {[
                                    { label: "Edad", val: patientData.age },
                                    { label: "Estado Civ.", val: "N/A" },
                                    { label: "Origen", val: patientData.center }
                                ].map((row, i) => (
                                    <div key={i} className="flex justify-between items-center py-2 border-b border-dashed border-zinc-100">
                                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{row.label}</span>
                                        <span className="text-[10px] font-black text-zinc-700 uppercase">{row.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#002b49] rounded-[32px] p-8 text-white space-y-6 shadow-xl">
                            <h3 className="text-[10px] font-black text-sky-400 uppercase tracking-[0.3em]">Gestión Rápida</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {['Turno', 'Nota', 'Alerta', 'PDF'].map((btn) => (
                                    <button key={btn} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-[#f9b000] hover:text-[#002b49] hover:border-[#f9b000] transition-all font-black text-[10px] uppercase tracking-widest flex flex-col items-center gap-2 group">
                                        <span className="text-lg group-hover:scale-125 transition-transform">⚡</span>
                                        {btn}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Tabs and Detailed Data */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Tab Switcher */}
                        <div className="flex items-center gap-8 bg-white p-2 rounded-[28px] border border-zinc-100 shadow-lg overflow-x-auto no-scrollbar">
                            {['Cronología', 'Turnos', 'Documentos', 'Estudios', 'Vacunas'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-8 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === tab ? "bg-[#0067b1] text-white shadow-lg shadow-[#0067b1]/30 rotate-1 scale-105" : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50"}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="min-h-[500px]">
                            {activeTab === 'Cronología' && (
                                <div className="space-y-8">
                                    {timeline.length > 0 ? timeline.map((event, i) => (
                                        <div key={i} className="flex gap-8 group">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-12 h-12 rounded-2xl ${event.color} flex items-center justify-center text-white text-[10px] font-black shadow-lg shadow-zinc-200`}>
                                                    {event.date.split('/')[0]}
                                                </div>
                                                <div className="w-1 flex-1 bg-zinc-100 my-2 rounded-full" />
                                            </div>
                                            <div className="flex-1 bg-white p-8 rounded-[36px] border border-zinc-100 shadow-xl hover:border-[#0067b1] transition-all group-hover:translate-x-2">
                                                <h4 className="text-xl font-black text-zinc-900 tracking-tight mb-2 uppercase">{event.title}</h4>
                                                <p className="text-zinc-500 text-sm font-bold leading-relaxed mb-6 italic opacity-80">"{event.details}"</p>
                                                <div className="flex items-center gap-6 pt-4 border-t border-dashed border-zinc-100 text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                                                    <span>📍 {event.clinic}</span>
                                                    <span>👤 {event.doctor}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="p-20 text-center bg-white border-4 border-dashed border-zinc-100 rounded-[56px] opacity-40">
                                            <span className="text-7xl">📂</span>
                                            <p className="font-black text-zinc-400 uppercase tracking-widest mt-6">Sin eventos registrados</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'Turnos' && (
                                <div className="space-y-8 animate-fade-in">
                                    {/* Formulario Crear Turno */}
                                    {profile?.rol !== 'administrativo' ? (
                                        <div className="bg-[#f0f9ff] p-10 rounded-[40px] border-2 border-[#0067b1]/10 shadow-inner">
                                            <h3 className="text-xl font-black text-[#002b49] uppercase tracking-tighter mb-8 flex items-center gap-3">
                                                <span className="w-8 h-8 rounded-lg bg-[#0067b1] text-white flex items-center justify-center text-sm">+</span>
                                                Programar Nueva Cita Médica
                                            </h3>
                                            <form onSubmit={handleCreateTurn} className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                                <div className="md:col-span-4 space-y-2">
                                                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-4">Fecha y Hora</label>
                                                    <input
                                                        type="datetime-local"
                                                        required
                                                        value={newTurnDate}
                                                        onChange={(e) => setNewTurnDate(e.target.value)}
                                                        className="w-full px-6 py-4 rounded-2xl bg-white border border-zinc-200 outline-none focus:border-[#0067b1] font-bold shadow-sm"
                                                    />
                                                </div>
                                                <div className="md:col-span-8 space-y-2">
                                                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-4">Especialidad o Servicio</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={newTurnSpecialty}
                                                        onChange={(e) => setNewTurnSpecialty(e.target.value)}
                                                        placeholder="Ej: Cardiología, Odontología..."
                                                        className="w-full px-6 py-4 rounded-2xl bg-white border border-zinc-200 outline-none focus:border-[#0067b1] font-bold shadow-sm"
                                                    />
                                                </div>
                                                <div className="md:col-span-9 space-y-2">
                                                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-4">Notas Internas (Opcional)</label>
                                                    <input
                                                        type="text"
                                                        value={newTurnNote}
                                                        onChange={(e) => setNewTurnNote(e.target.value)}
                                                        placeholder="Motivo de consulta o indicaciones previas..."
                                                        className="w-full px-6 py-4 rounded-2xl bg-white border border-zinc-200 outline-none focus:border-[#0067b1] font-bold shadow-sm"
                                                    />
                                                </div>
                                                <div className="md:col-span-3 flex items-end">
                                                    <button
                                                        type="submit"
                                                        disabled={creatingTurn}
                                                        className={`w-full py-5 rounded-2xl bg-[#0067b1] text-white font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-[#0067b1]/20 ${creatingTurn ? 'opacity-50' : 'hover:bg-[#005694] active:scale-95'}`}
                                                    >
                                                        {creatingTurn ? 'Guardando...' : 'Programar Turno'}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    ) : (
                                        <div className="p-10 rounded-[40px] border-2 border-dashed border-zinc-200 bg-zinc-50 flex items-center gap-6 shadow-inner animate-in fade-in slide-in-from-top-4 duration-700">
                                            <span className="text-4xl grayscale">🚫</span>
                                            <div>
                                                <p className="text-[10px] font-black text-[#002b49] uppercase tracking-widest mb-1">Permisos Restringidos</p>
                                                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Su rol actual (<span className="text-[#0067b1]">{profile?.rol}</span>) no permite la creación o modificación de turnos.</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Listado de Turnos */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between px-6">
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Agenda de Turnos ({turns.length})</p>
                                            <button onClick={fetchTurns} className="p-2 hover:bg-white rounded-xl transition-all font-black text-[#0067b1] text-[10px] hover:shadow-md uppercase tracking-widest">🔄 Actualizar</button>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            {loadingTurns ? (
                                                <div className="p-20 text-center animate-pulse bg-white rounded-[40px] border border-zinc-100 shadow-md">
                                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Sincronizando con Agenda Central...</p>
                                                </div>
                                            ) : turns.length > 0 ? (
                                                turns.map((turn) => (
                                                    <div key={turn.id} className="p-8 rounded-[32px] bg-white border border-zinc-100 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-[#0067b1] hover:shadow-2xl group">
                                                        <div className="flex items-center gap-6">
                                                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg ${turn.estado === 'realizado' ? 'bg-emerald-500' :
                                                                turn.estado === 'cancelado' ? 'bg-red-500' : 'bg-[#0067b1]'
                                                                }`}>
                                                                {new Date(turn.fecha_hora).getDate()}
                                                                <br />
                                                                {new Date(turn.fecha_hora).toLocaleString('es', { month: 'short' }).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-black text-xl text-zinc-900 tracking-tight leading-tight uppercase">{turn.especialidad}</h4>
                                                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">
                                                                    🕒 {new Date(turn.fecha_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {turn.profesional || 'Asignando Profesional'}
                                                                </p>
                                                                {turn.nota && <p className="text-[11px] font-bold text-zinc-400 mt-2 italic">"{turn.nota}"</p>}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-4">
                                                            {profile?.rol !== 'administrativo' ? (
                                                                <select
                                                                    value={turn.estado}
                                                                    onChange={(e) => handleUpdateTurnStatus(turn.id, e.target.value)}
                                                                    className="px-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#0067b1] transition-all"
                                                                >
                                                                    <option value="programado">Programado</option>
                                                                    <option value="realizado">Atendido</option>
                                                                    <option value="cancelado">Cancelado</option>
                                                                    <option value="ausente">Ausente</option>
                                                                </select>
                                                            ) : (
                                                                <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${turn.estado === 'realizado' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                                    turn.estado === 'cancelado' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                                                                    }`}>
                                                                    {turn.estado}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-20 text-center bg-white border border-zinc-100 rounded-[40px] shadow-inner opacity-60">
                                                    <span className="text-6xl grayscale">📅</span>
                                                    <p className="font-black text-zinc-400 uppercase tracking-widest mt-6 italic">No hay turnos registrados</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'Documentos' && (
                                <div className="space-y-8 animate-fade-in">
                                    {/* Subida Section */}
                                    {profile?.rol !== 'administrativo' ? (
                                        <div className="bg-[#f8fafc] p-10 rounded-[40px] border-2 border-[#0067b1]/10 shadow-inner">
                                            <h3 className="text-xl font-black text-[#002b49] uppercase tracking-tighter mb-8 flex items-center gap-3">
                                                <span className="w-8 h-8 rounded-lg bg-[#0067b1] text-white flex items-center justify-center text-sm">+</span>
                                                Digitalizar Nuevo Documento
                                            </h3>
                                            <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                                <div className="md:col-span-8 space-y-2">
                                                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-4">Título Identificador</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={uploadTitle}
                                                        onChange={(e) => setUploadTitle(e.target.value)}
                                                        className="w-full px-6 py-4 rounded-2xl bg-white border border-zinc-200 outline-none focus:border-[#0067b1] font-bold shadow-sm"
                                                        placeholder="Ej: Análisis Laboratorio - Feb 2024"
                                                    />
                                                </div>
                                                <div className="md:col-span-4 space-y-2">
                                                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-4">Categoría</label>
                                                    <select
                                                        value={uploadType}
                                                        onChange={(e) => setUploadType(e.target.value)}
                                                        className="w-full px-6 py-4 rounded-2xl bg-white border border-zinc-200 outline-none focus:border-[#0067b1] font-bold shadow-sm"
                                                    >
                                                        <option value="dni">Documento de Identidad</option>
                                                        <option value="historia_clinica">Historia Clínica</option>
                                                        <option value="laboratorio">Laboratorio / Estudios</option>
                                                        <option value="otro">Otros Archivos</option>
                                                    </select>
                                                </div>
                                                <div className="md:col-span-9 space-y-2">
                                                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-4">Archivo (PDF o Imagen Soporte)</label>
                                                    <input
                                                        type="file"
                                                        required
                                                        accept="application/pdf,image/*"
                                                        onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                                                        className="w-full px-6 py-4 rounded-2xl bg-white border border-zinc-200 outline-none focus:border-[#0067b1] font-bold shadow-sm"
                                                    />
                                                </div>
                                                <div className="md:col-span-3 flex items-end">
                                                    <button
                                                        type="submit"
                                                        disabled={uploading}
                                                        className={`w-full py-5 rounded-2xl bg-[#0067b1] text-white font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-[#0067b1]/20 ${uploading ? 'opacity-50' : 'hover:bg-[#005694] active:scale-95'}`}
                                                    >
                                                        {uploading ? 'Procesando...' : 'Subir Archivo'}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    ) : (
                                        <div className="p-10 rounded-[40px] border-2 border-dashed border-zinc-200 bg-zinc-50 flex items-center gap-6 shadow-inner animate-in fade-in slide-in-from-top-4 duration-700">
                                            <span className="text-4xl grayscale">🚫</span>
                                            <div>
                                                <p className="text-[10px] font-black text-[#002b49] uppercase tracking-widest mb-1">Permisos Restringidos</p>
                                                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Su rol actual (<span className="text-[#0067b1]">{profile?.rol}</span>) solo permite la visualización de metadatos. La carga de archivos no está habilitada.</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Listado Section */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between px-6">
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Repositorio de Archivos ({documents.length})</p>
                                            <button onClick={fetchDocuments} className="p-2 hover:bg-white rounded-xl transition-all font-black text-[#0067b1] text-[10px] hover:shadow-md uppercase tracking-widest">🔄 Sincronizar</button>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            {loadingDocs ? (
                                                <div className="p-20 text-center animate-pulse bg-white rounded-[40px] border border-zinc-100 shadow-md">
                                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Conectando con Supabase Storage...</p>
                                                </div>
                                            ) : documents.length > 0 ? (
                                                documents.map((doc) => (
                                                    <div key={doc.id} className="p-6 rounded-[32px] bg-white border border-zinc-100 shadow-lg flex items-center justify-between transition-all hover:border-[#0067b1] hover:shadow-2xl hover:translate-x-1 group">
                                                        <div className="flex items-center gap-6">
                                                            <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center text-3xl group-hover:rotate-6 transition-transform shadow-inner">
                                                                {doc.mime?.includes('pdf') ? '📄' : '🖼️'}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-black text-lg text-zinc-900 tracking-tight leading-tight uppercase">{doc.titulo}</h4>
                                                                <div className="flex items-center gap-3 text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-2 border-t border-zinc-50 pt-2">
                                                                    <span className="text-[#0067b1]">{doc.tipo}</span>
                                                                    <span>•</span>
                                                                    <span>{(doc.size / 1024).toFixed(1)} KB</span>
                                                                    <span>•</span>
                                                                    <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {profile?.rol !== 'administrativo' ? (
                                                            <button
                                                                onClick={() => handleDownload(doc.id)}
                                                                className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#002b49] text-white font-black uppercase text-[10px] tracking-widest hover:bg-[#0067b1] transition-all active:scale-95 shadow-lg group-hover:scale-105"
                                                            >
                                                                <span>⬇️</span> Ver Archivo
                                                            </button>
                                                        ) : (
                                                            <div className="px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">
                                                                Solo Lectura
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-20 text-center bg-white border border-zinc-100 rounded-[40px] shadow-inner opacity-60">
                                                    <span className="text-6xl grayscale">📂</span>
                                                    <p className="font-black text-zinc-400 uppercase tracking-widest mt-6 italic">No se encontraron documentos digitalizados</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(activeTab === 'Estudios' || activeTab === 'Vacunas') && (
                                <div className="p-20 text-center bg-white border border-zinc-100 rounded-[56px] shadow-xl space-y-6">
                                    <div className="w-24 h-24 rounded-full bg-zinc-50 border border-dashed border-zinc-200 mx-auto flex items-center justify-center text-4xl grayscale opacity-30">
                                        🛠️
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-xl font-black text-zinc-900 tracking-tighter uppercase">Módulo en Desarrollo</h4>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Esta sección estará disponible en la próxima actualización ministerial.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : !loading && !showAuditModal && (
                <div className="p-20 text-center bg-white border-2 border-dashed border-zinc-200 rounded-[56px] space-y-8 animate-pulse">
                    <span className="text-7xl">🔍</span>
                    <div className="space-y-2">
                        <h4 className="text-2xl font-black text-zinc-400 uppercase tracking-tighter">Buscando Registro Unificado...</h4>
                        <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest italic">Consulte por DNI para iniciar la validación de identidad</p>
                    </div>
                </div>
            )}
        </div>
    );
}
