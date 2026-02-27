"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Persona, Turno, Documento, Profile } from "@/types";
import {
    Search,
    User,
    Calendar,
    Clock,
    ArrowRight,
    AlertCircle,
    ShieldCheck,
    FileText,
    History,
    ClipboardList,
    FileStack,
    FlaskConical,
    Syringe,
    Plus,
    RefreshCw,
    Download,
    Eye,
    Lock,
    Zap,
    Building2
} from "lucide-react";

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
            const resAuth = await fetch('/api/auth/me');
            const dataAuth = await resAuth.json();
            if (!dataAuth.ok || !dataAuth.user) {
                router.push("/login");
                return;
            }
            setUser(dataAuth.user);

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
            const res = await fetch(`/api/personas/${personaId}`);
            if (!res.ok) throw new Error(`Status: ${res.status}`);
            const data = await res.json();
            if (data.ok) {
                setPatient(data.item);
            }
        } catch (error) {
            console.error("Fetch patient error:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDocuments = async () => {
        if (!personaId) return;
        setLoadingDocs(true);
        try {
            const res = await fetch(`/api/personas/${personaId}/documentos`);
            if (!res.ok) throw new Error(`Status: ${res.status}`);
            const data = await res.json();
            if (data.ok && data.items) {
                setDocuments(data.items);
            }
        } catch (error) {
            console.error("Fetch docs error:", error);
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
            console.error("Audit log error:", error);
            setAuditApiError(error.message || "Error al validar identidad. Intente nuevamente.");
        } finally {
            setIsAuditing(false);
        }
    };

    if (loading && !showAuditModal) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCw className="w-10 h-10 text-brand-navy animate-spin" />
                    <p className="text-brand-navy text-xs font-bold uppercase tracking-widest">Sincronizando Historial Clínico...</p>
                </div>
            </div>
        );
    }

    if (!patient && !loading && !showAuditModal) {
        return (
            <div className="text-center py-20 px-4">
                <div className="max-w-md mx-auto admin-card p-10 space-y-6">
                    <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No se encontró el registro solicitado</p>
                    <button
                        onClick={() => router.push('/ficha-unificada?id=8903f85b-c12a-403d-a9fa-8bc709f077c8')}
                        className="w-full btn-primary py-3 text-[10px]"
                    >Cargar Registro Sugerido</button>
                </div>
            </div>
        );
    }

    const patientData = patient ? {
        name: `${patient.nombre} ${patient.apellido}`,
        dni: patient.dni,
        age: patient.fecha_nacimiento ? `${new Date().getFullYear() - new Date(patient.fecha_nacimiento).getFullYear()} años` : "N/A",
        status: "Activo",
        center: "Sistema Provincial de Salud",
        obs: ["Registro oficial del Ministerio de Salud."]
    } : null;

    const timeline = patient ? [
        ...(patient.turnos || []).map((t: any) => ({
            date: new Date(t.fecha).toLocaleDateString(),
            title: `Atención: ${t.especialidad}`,
            doctor: t.profesional,
            clinic: "Efector Público",
            icon: <ClipboardList className="w-5 h-5" />,
            color: "bg-brand-navy",
            details: t.notas || `Estado: ${t.estado}`
        })),
        ...(patient.reclamos || []).map((r: any) => ({
            date: new Date(r.created_at).toLocaleDateString(),
            title: `Reclamo: ${r.categoria}`,
            doctor: "Gestión Administrativa",
            clinic: "Atención Ciudadana",
            icon: <AlertCircle className="w-5 h-5" />,
            color: "bg-red-600",
            details: r.descripcion || `Urgencia: ${r.urgencia}`
        }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : [];

    return (
        <div className="space-y-8 animate-fade-in max-w-7xl mx-auto px-4 py-6">
            {/* AUDIT MODAL */}
            {showAuditModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
                        <div className="p-8 bg-brand-navy text-white space-y-1">
                            <h3 className="text-2xl font-bold tracking-tight">Protocolo de Acceso Seguro</h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Ley 25.326 • Seguridad de la Información</p>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block ml-1">Motivo de Visualización</label>
                                <textarea
                                    value={auditReason}
                                    onChange={(e) => { setAuditReason(e.target.value); setAuditError(false); setAuditApiError(""); }}
                                    placeholder="Describa el motivo de la consulta..."
                                    className={`w-full h-32 px-5 py-4 rounded-2xl bg-slate-50 border ${auditError || auditApiError ? 'border-red-500 bg-red-50' : 'border-slate-200'} focus:border-brand-navy outline-none transition-all font-semibold text-slate-900 placeholder:text-slate-400 resize-none shadow-sm`}
                                />
                                {(auditError || auditApiError) && (
                                    <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest ml-1">
                                        {auditApiError || "Campo obligatorio (mín. 5 caracteres)"}
                                    </p>
                                )}
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 flex items-center gap-3 border border-slate-100">
                                <Lock className="w-5 h-5 text-brand-navy" />
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                    Acceso auditado para: <span className="text-brand-navy">{user?.email || 'N/A'}</span>
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={handleConfirmAudit}
                                    disabled={isAuditing}
                                    className={`w-full btn-primary py-4 uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-2 ${isAuditing ? 'opacity-70' : ''}`}
                                >
                                    {isAuditing ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Validar y Continuar"}
                                </button>
                                <button
                                    onClick={() => router.push('/')}
                                    className="w-full py-3 text-slate-400 font-bold uppercase tracking-widest text-[9px] hover:text-slate-600 transition-all"
                                >
                                    Cancelar Acceso
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header / Search Area */}
            <section className="admin-card p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-brand-navy/5 flex items-center justify-center text-brand-navy">
                            <History className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ficha Unificada del Paciente</h1>
                            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Registro Público • Provincia de Catamarca</p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold uppercase tracking-wider">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        Conexión Segura
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-end gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Identificador de Registro o DNI</label>
                        <div className="relative group">
                            <input
                                type="text"
                                defaultValue={personaId || ""}
                                id="search-input"
                                className="w-full pl-12 pr-6 py-4 rounded-xl bg-white border border-slate-200 focus:border-brand-navy outline-none font-bold text-lg text-slate-900 shadow-sm transition-all"
                                placeholder="DNI o UUID..."
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            const val = (document.getElementById('search-input') as HTMLInputElement).value;
                            if (val) router.push(`/ficha-unificada?id=${val}`);
                        }}
                        className="btn-primary flex items-center gap-2 px-8 py-[18px] text-[11px] h-[60px]"
                    >
                        Acceder
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => router.push('/ficha-unificada?id=8903f85b-c12a-403d-a9fa-8bc709f077c8')}
                        className="px-6 py-[18px] rounded-xl bg-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px] hover:bg-slate-300 transition-all h-[60px]"
                    >
                        Registro de Prueba
                    </button>
                </div>
            </section>

            {patientData ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Sidebar: Brief Info */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="admin-card p-6 text-center space-y-6 relative overflow-hidden">
                            <div className="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-100 mx-auto flex items-center justify-center text-slate-400 shadow-inner">
                                <User className="w-12 h-12" />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{patientData.name}</h2>
                                <p className="text-[11px] font-bold text-brand-navy uppercase tracking-widest bg-brand-navy/5 inline-block px-3 py-1 rounded-full">DNI: {patientData.dni}</p>
                            </div>

                            <div className="space-y-3 text-left pt-4">
                                {[
                                    { label: <><Clock className="w-3.5 h-3.5" /> Edad</>, val: patientData.age },
                                    { label: <><ShieldCheck className="w-3.5 h-3.5" /> Estado</>, val: patientData.status },
                                    { label: <><Building2 className="w-3.5 h-3.5" /> Centro</>, val: "M.S.P. Catamarca" }
                                ].map((row, i) => (
                                    <div key={i} className="flex justify-between items-center py-2.5 border-b border-slate-50">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">{row.label}</span>
                                        <span className="text-[11px] font-bold text-slate-700 uppercase">{row.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="admin-card bg-brand-navy p-6 text-white space-y-4 shadow-md">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/50 border-b border-white/10 pb-2">Acciones Rápidas</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { name: "Cita", icon: <Calendar className="w-4 h-4" /> },
                                    { name: "Nota", icon: <FileText className="w-4 h-4" /> },
                                    { name: "Soporte", icon: <Zap className="w-4 h-4" /> },
                                    { name: "PDF", icon: <Download className="w-4 h-4" /> }
                                ].map((btn) => (
                                    <button key={btn.name} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-white">
                                        {btn.icon}
                                        <span className="font-bold text-[9px] uppercase tracking-wider">{btn.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Main Panel: Detail Tabs */}
                    <div className="lg:col-span-9 space-y-6">
                        {/* Tab Switcher */}
                        <div className="flex items-center gap-6 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
                            {[
                                { name: 'Cronología', icon: <History className="w-4 h-4" /> },
                                { name: 'Turnos', icon: <Calendar className="w-4 h-4" /> },
                                { name: 'Documentos', icon: <FileStack className="w-4 h-4" /> },
                                { name: 'Estudios', icon: <FlaskConical className="w-4 h-4" /> },
                                { name: 'Vacunas', icon: <Syringe className="w-4 h-4" /> }
                            ].map(tab => (
                                <button
                                    key={tab.name}
                                    onClick={() => setActiveTab(tab.name)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.name ? "bg-brand-navy text-white shadow-md shadow-brand-navy/20" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}
                                >
                                    {tab.icon}
                                    {tab.name}
                                </button>
                            ))}
                        </div>

                        <div className="py-6 min-h-[500px]">
                            {activeTab === 'Cronología' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    {timeline.length > 0 ? timeline.map((event, i) => (
                                        <div key={i} className="flex gap-6 group">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-10 h-10 rounded-xl ${event.color} flex items-center justify-center text-white shadow-md`}>
                                                    {event.icon}
                                                </div>
                                                <div className="w-0.5 flex-1 bg-slate-100 my-2 rounded-full" />
                                            </div>
                                            <div className="flex-1 admin-card p-6 hover:border-brand-navy transition-all group-hover:translate-x-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="text-lg font-bold text-slate-900 tracking-tight">{event.title}</h4>
                                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{event.date}</span>
                                                </div>
                                                <p className="text-slate-500 text-sm leading-relaxed mb-4 font-medium italic">"{event.details}"</p>
                                                <div className="flex items-center gap-4 pt-4 border-t border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                    <span className="flex items-center gap-1.5"><Building2 className="w-3 h-3" /> {event.clinic}</span>
                                                    <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> {event.doctor}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="p-20 text-center admin-card border-dashed">
                                            <FileStack className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                            <p className="font-bold text-slate-400 uppercase tracking-widest text-[11px]">Sin eventos clínicos registrados</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'Turnos' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    {/* Create Turn Section */}
                                    <div className="admin-card bg-slate-50 p-6 border-slate-200">
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-6 flex items-center gap-2">
                                            <Plus className="w-4 h-4 text-brand-navy" />
                                            Programar Atención Médica
                                        </h3>
                                        <form onSubmit={handleCreateTurn} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                            <div className="md:col-span-4 space-y-1.5">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Fecha y Horario</label>
                                                <input
                                                    type="datetime-local"
                                                    required
                                                    value={newTurnDate}
                                                    onChange={(e) => setNewTurnDate(e.target.value)}
                                                    className="w-full input-sober py-2.5 text-sm"
                                                />
                                            </div>
                                            <div className="md:col-span-8 space-y-1.5">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Servicio / Especialidad</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={newTurnSpecialty}
                                                    onChange={(e) => setNewTurnSpecialty(e.target.value)}
                                                    placeholder="Ej: Clínica Médica, Pediatría..."
                                                    className="w-full input-sober py-2.5 text-sm"
                                                />
                                            </div>
                                            <div className="md:col-span-12 space-y-1.5">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Observaciones</label>
                                                <input
                                                    type="text"
                                                    value={newTurnNote}
                                                    onChange={(e) => setNewTurnNote(e.target.value)}
                                                    placeholder="Motivo de la consulta o notas preventivas..."
                                                    className="w-full input-sober py-2.5 text-sm"
                                                />
                                            </div>
                                            <div className="md:col-span-12 flex justify-end">
                                                <button
                                                    type="submit"
                                                    disabled={creatingTurn}
                                                    className="btn-primary px-8 py-3 text-[11px] flex items-center gap-2"
                                                >
                                                    {creatingTurn ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Calendar className="w-3.5 h-3.5" />}
                                                    Confirmar Turno
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                    {/* Turns List */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between px-2">
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Agenda de Citas ({turns.length})</p>
                                            <button onClick={fetchTurns} className="text-brand-navy hover:text-brand-navy-2 transition-colors flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-wider">
                                                <RefreshCw className="w-3 h-3" /> Sincronizar
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3">
                                            {loadingTurns ? (
                                                <div className="p-12 text-center animate-pulse admin-card">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Consultando Agenda Digital...</p>
                                                </div>
                                            ) : turns.length > 0 ? (
                                                turns.map((turn) => (
                                                    <div key={turn.id} className="admin-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-brand-navy transition-all group">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center text-white shadow-sm ${turn.estado === 'realizado' ? 'bg-emerald-500' :
                                                                turn.estado === 'cancelado' ? 'bg-red-500' : 'bg-brand-navy'
                                                                }`}>
                                                                <span className="text-xs font-bold leading-none">{new Date(turn.fecha_hora).getDate()}</span>
                                                                <span className="text-[8px] font-bold uppercase">{new Date(turn.fecha_hora).toLocaleString('es', { month: 'short' })}</span>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-slate-900 uppercase tracking-tight">{turn.especialidad}</h4>
                                                                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(turn.fecha_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {turn.profesional || 'Por asignar'}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            {profile?.rol !== 'administrativo' ? (
                                                                <select
                                                                    value={turn.estado}
                                                                    onChange={(e) => handleUpdateTurnStatus(turn.id, e.target.value)}
                                                                    className="px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-brand-navy transition-all"
                                                                >
                                                                    <option value="programado">Programado</option>
                                                                    <option value="realizado">Atendido</option>
                                                                    <option value="cancelado">Cancelado</option>
                                                                </select>
                                                            ) : (
                                                                <div className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${turn.estado === 'realizado' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                                    turn.estado === 'cancelado' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-brand-navy/5 text-brand-navy border-brand-navy/10'
                                                                    }`}>
                                                                    {turn.estado}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-16 text-center admin-card border-dashed">
                                                    <Calendar className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                                                    <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">No se registran turnos pendientes</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'Documentos' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    {/* Upload Section */}
                                    {profile?.rol !== 'administrativo' ? (
                                        <div className="admin-card bg-slate-50 p-6 border-slate-200">
                                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-6 flex items-center gap-2">
                                                <Plus className="w-4 h-4 text-brand-navy" />
                                                Digitalizar Documentación
                                            </h3>
                                            <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                                <div className="md:col-span-8 space-y-1.5">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Descripción del Archivo</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={uploadTitle}
                                                        onChange={(e) => setUploadTitle(e.target.value)}
                                                        className="w-full input-sober py-2.5 text-sm"
                                                        placeholder="Ej: Informe Radiológico Torax"
                                                    />
                                                </div>
                                                <div className="md:col-span-4 space-y-1.5">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Categoría</label>
                                                    <select
                                                        value={uploadType}
                                                        onChange={(e) => setUploadType(e.target.value)}
                                                        className="w-full input-sober py-2.5 text-sm"
                                                    >
                                                        <option value="dni">Identidad</option>
                                                        <option value="historia_clinica">Historia Clínica</option>
                                                        <option value="laboratorio">Estudios Externos</option>
                                                        <option value="otro">Otros</option>
                                                    </select>
                                                </div>
                                                <div className="md:col-span-9 space-y-1.5">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Seleccionar Archivo (PDF/IMG)</label>
                                                    <input
                                                        type="file"
                                                        required
                                                        accept="application/pdf,image/*"
                                                        onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                                                        className="w-full input-sober py-2 px-3 text-xs bg-white"
                                                    />
                                                </div>
                                                <div className="md:col-span-3 flex items-end">
                                                    <button
                                                        type="submit"
                                                        disabled={uploading}
                                                        className="btn-primary w-full py-3.5 text-[11px] flex items-center justify-center gap-2"
                                                    >
                                                        {uploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileStack className="w-3.5 h-3.5" />}
                                                        Procesar Carga
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    ) : (
                                        <div className="admin-card p-6 border-slate-200 bg-slate-50/50 flex items-center gap-4 text-slate-400">
                                            <Lock className="w-6 h-6" />
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest leading-none mb-1">Carga Deshabilitada</p>
                                                <p className="text-[9px] font-medium leading-none">Su rol administrativo solo permite visualización.</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Docs List */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between px-2">
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Repositorio Digital ({documents.length})</p>
                                            <button onClick={fetchDocuments} className="text-brand-navy hover:text-brand-navy-2 transition-colors flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-wider">
                                                <RefreshCw className="w-3 h-3" /> Sincronizar
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3">
                                            {loadingDocs ? (
                                                <div className="p-12 text-center animate-pulse admin-card">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Consultando Repositorio Central...</p>
                                                </div>
                                            ) : documents.length > 0 ? (
                                                documents.map((doc) => (
                                                    <div key={doc.id} className="admin-card p-4 flex items-center justify-between hover:border-brand-navy transition-all group">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-brand-navy transition-colors">
                                                                <FileText className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-slate-900 uppercase tracking-tight leading-none mb-1">{doc.titulo}</h4>
                                                                <div className="flex items-center gap-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                                    <span className="text-brand-navy bg-brand-navy/5 px-2 py-0.5 rounded-md">{doc.tipo}</span>
                                                                    <span>{(doc.size / 1024).toFixed(1)} KB</span>
                                                                    <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {profile?.rol !== 'administrativo' ? (
                                                            <button
                                                                onClick={() => handleDownload(doc.id)}
                                                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider hover:bg-black transition-all shadow-sm"
                                                            >
                                                                <Eye className="w-3.5 h-3.5" />
                                                                Visualizar
                                                            </button>
                                                        ) : (
                                                            <Lock className="w-4 h-4 text-slate-200" />
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-16 text-center admin-card border-dashed">
                                                    <FileStack className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                                                    <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Sin documentación digitalizada</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(activeTab === 'Estudios' || activeTab === 'Vacunas') && (
                                <div className="p-20 text-center admin-card bg-slate-50/30 border-dashed space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-white shadow-inner mx-auto flex items-center justify-center text-slate-200">
                                        <ShieldCheck className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-bold text-slate-900 tracking-tight uppercase">Módulo en Integración</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Los datos estarán disponibles en la Fase 3 del despliegue.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : !loading && !showAuditModal && (
                <div className="admin-card p-20 text-center border-dashed space-y-4 animate-pulse">
                    <History className="w-12 h-12 text-slate-100 mx-auto" />
                    <div className="space-y-1">
                        <h4 className="text-2xl font-bold text-slate-200 uppercase tracking-tighter">Buscando Registro...</h4>
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Ingrese un identificador válido para visualizar el historial.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
