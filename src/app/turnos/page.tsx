'use client'

import { useState, useEffect } from 'react'
import { Turno, Persona } from '@/types'

import {
    Calendar,
    Clock,
    Plus,
    Search,
    ChevronRight,
    LayoutList,
    CalendarDays,
    User,
    CircleCheck,
    CircleX,
    AlertTriangle,
    MoreVertical,
    CheckCircle2,
    XCircle,
    AlertCircle
} from "lucide-react";

export default function TurnosPage() {
    const [view, setView] = useState<'lista' | 'calendario'>('lista')
    const [turnos, setTurnos] = useState<Turno[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedSpecialty, setSelectedSpecialty] = useState('Todas')
    const [isModalOpen, setIsModalOpen] = useState(false)

    // New Turno state
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState<Persona[]>([])
    const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)
    const [newTurno, setNewTurno] = useState({
        fecha_hora: '',
        especialidad: 'Clínica Médica',
        nota: ''
    })

    useEffect(() => {
        fetchTurnos()
    }, [])

    const fetchTurnos = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/turnos')
            const data = await res.json()
            if (data.ok) {
                setTurnos(data.items || [])
            }
        } catch (error) {
            console.error('Error fetching turnos:', error)
        } finally {
            setLoading(false)
        }
    }

    const searchPersonas = async (term: string) => {
        if (term.length < 3) {
            setSearchResults([])
            return
        }
        try {
            const res = await fetch(`/api/personas/search?q=${term}`)
            const data = await res.json()
            if (data.ok) {
                setSearchResults(data.items || [])
            }
        } catch (error) {
            console.error('Error searching personas:', error)
        }
    }

    const handleCreateTurno = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedPersona) {
            alert('Debe seleccionar una persona')
            return
        }
        try {
            const res = await fetch(`/api/personas/${selectedPersona.id}/turnos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTurno)
            })
            const data = await res.json()
            if (data.ok) {
                setIsModalOpen(false)
                setNewTurno({ fecha_hora: '', especialidad: 'Clínica Médica', nota: '' })
                setSelectedPersona(null)
                setSearchTerm('')
                fetchTurnos()
            } else {
                alert(data.error || 'Error al crear turno')
            }
        } catch (error) {
            console.error('Error creating turno:', error)
        }
    }

    const handleUpdateStatus = async (id: string, nuevoEstado: string) => {
        try {
            const res = await fetch(`/api/turnos/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: nuevoEstado })
            })
            const data = await res.json()
            if (data.ok) {
                fetchTurnos()
            }
        } catch (error) {
            console.error('Error updating status:', error)
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'realizado': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            case 'cancelado': return <XCircle className="w-4 h-4 text-red-500" />
            case 'ausente': return <AlertCircle className="w-4 h-4 text-amber-500" />
            default: return <Clock className="w-4 h-4 text-brand-navy/50" />
        }
    }

    const specialties = ['Todas', ...Array.from(new Set(turnos.map(t => t.especialidad || 'Sin especialidad')))]

    const filteredTurnos = turnos.filter(t =>
        selectedSpecialty === 'Todas' || t.especialidad === selectedSpecialty
    )

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 font-outfit">
            {/* Header Institucional */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 admin-card p-8 bg-white border-slate-200">
                <div>
                    <h1 className="text-2xl font-black text-brand-navy tracking-tight flex items-center gap-3">
                        <Calendar className="w-8 h-8 text-brand-navy" />
                        Gestión de Turnos
                    </h1>
                    <p className="text-slate-500 font-bold mt-1 text-[10px] uppercase tracking-widest">Agenda unificada y administración de citas del Ministerio</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex p-1 bg-slate-100 rounded-xl">
                        <button
                            onClick={() => setView('lista')}
                            className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 ${view === 'lista' ? 'bg-white text-brand-navy shadow-sm' : 'text-slate-500 hover:text-brand-navy'}`}
                        >
                            <LayoutList className="w-4 h-4" />
                            Lista
                        </button>
                        <button
                            onClick={() => setView('calendario')}
                            className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 ${view === 'calendario' ? 'bg-white text-brand-navy shadow-sm' : 'text-slate-500 hover:text-brand-navy'}`}
                        >
                            <CalendarDays className="w-4 h-4" />
                            Vista
                        </button>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary flex items-center gap-2 px-6 py-3"
                    >
                        <Plus className="w-4 h-4" />
                        Nuevo Turno
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Filtros */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="admin-card p-6 border-slate-200 bg-white space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Especialidades</label>
                            <div className="space-y-1">
                                {specialties.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setSelectedSpecialty(s)}
                                        className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-tight transition-all border ${selectedSpecialty === s ? 'bg-brand-navy text-white border-brand-navy shadow-md' : 'text-slate-600 hover:bg-slate-50 border-transparent'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                            <div className="p-4 rounded-2xl bg-slate-50 text-center border border-slate-200">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
                                <p className="text-2xl font-black text-brand-navy leading-none">{filteredTurnos.length}</p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Citas en Agenda</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-slate-50 rounded-2xl animate-pulse" />)}
                        </div>
                    ) : view === 'lista' ? (
                        <div className="space-y-4">
                            {filteredTurnos.length === 0 ? (
                                <div className="bg-white border-2 border-dashed border-slate-200 rounded-[32px] p-20 text-center">
                                    <Calendar className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                    <h3 className="text-lg font-black text-slate-900 uppercase">Sin turnos registrados</h3>
                                    <p className="text-slate-500 mt-2 text-xs font-bold uppercase tracking-widest">Los turnos para esta especialidad aparecerán aquí.</p>
                                </div>
                            ) : (
                                filteredTurnos.map(turno => (
                                    <div key={turno.id} className="admin-card p-5 bg-white border-slate-200 hover:border-brand-navy/30 transition-all flex items-center justify-between group overflow-hidden relative">
                                        <div className="flex items-center gap-6 relative z-10">
                                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-200 group-hover:bg-brand-navy/5 transition-colors">
                                                <span className="text-[9px] font-black text-slate-400 uppercase leading-none">{new Date(turno.fecha_hora).toLocaleDateString('es', { month: 'short' })}</span>
                                                <span className="text-2xl font-black text-brand-navy leading-tight">{new Date(turno.fecha_hora).getDate()}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h3 className="font-black text-base text-slate-900 uppercase tracking-tight group-hover:text-brand-navy transition-colors">
                                                        {(turno as any).personas?.nombre} {(turno as any).personas?.apellido}
                                                    </h3>
                                                    <span className="px-2 py-0.5 bg-slate-100 text-[9px] font-black text-slate-500 rounded-full border border-slate-200 uppercase">
                                                        DNI: {(turno as any).personas?.dni}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest opacity-60">
                                                    {turno.especialidad} • <span className="text-brand-navy font-black">{turno.profesional || 'ASIGNANDO...'}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 relative z-10">
                                            <div className="text-right">
                                                <p className="text-xl font-black text-brand-navy leading-none">{new Date(turno.fecha_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                <div className="flex items-center gap-1.5 justify-end mt-2">
                                                    {getStatusIcon(turno.estado)}
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{turno.estado}</span>
                                                </div>
                                            </div>

                                            <div className="relative group/actions">
                                                <button className="w-10 h-10 bg-slate-50 rounded-xl text-slate-400 hover:text-brand-navy flex items-center justify-center hover:bg-white hover:shadow-md transition-all border border-slate-200">
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>
                                                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl opacity-0 invisible group-hover/actions:opacity-100 group-hover/actions:visible transition-all z-20 overflow-hidden p-2 space-y-1">
                                                    {['programado', 'realizado', 'cancelado', 'ausente'].map(st => (
                                                        <button
                                                            key={st}
                                                            onClick={() => handleUpdateStatus(turno.id, st)}
                                                            className="w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-slate-50 hover:text-brand-navy rounded-xl"
                                                        >
                                                            Marcar {st}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="admin-card p-20 bg-white border-slate-200 text-center space-y-6 relative overflow-hidden">
                            <div className="relative z-10">
                                <CalendarDays className="w-20 h-20 text-slate-200 mx-auto mb-6" />
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-black text-brand-navy tracking-tight uppercase">Módulo de Calendario</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest max-w-sm mx-auto">Visualización avanzada en etapa de construcción para la próxima fase ministerial.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Nuevo Turno */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20">
                        <div className="p-8 border-b-2 border-dashed border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-2xl font-black text-brand-navy tracking-tight uppercase flex items-center gap-3">
                                <Plus className="w-6 h-6 p-1 bg-brand-navy text-white rounded-lg" />
                                Agendar Turno
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:text-brand-navy hover:bg-white transition-all">
                                <Plus className="rotate-45" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateTurno} className="p-8 space-y-8">
                            {/* Buscador de Persona */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Paciente</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="DNI o Apellido..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value)
                                            searchPersonas(e.target.value)
                                        }}
                                        className="input-sober pl-12"
                                    />
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                </div>

                                {searchResults.length > 0 && !selectedPersona && (
                                    <div className="bg-white border-2 border-slate-100 rounded-2xl shadow-2xl max-h-56 overflow-y-auto mt-2 absolute w-[calc(100%-4rem)] z-30 p-2 space-y-1">
                                        {searchResults.map(p => (
                                            <button
                                                key={p.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedPersona(p)
                                                    setSearchTerm(`${p.apellido}, ${p.nombre}`)
                                                    setSearchResults([])
                                                }}
                                                className="w-full px-6 py-4 text-left hover:bg-slate-50 rounded-xl flex justify-between items-center group transition-all"
                                            >
                                                <span className="text-sm font-black text-slate-700 uppercase">{p.apellido}, {p.nombre}</span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase">DNI: {p.dni}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {selectedPersona && (
                                    <div className="flex items-center justify-between p-4 bg-brand-navy text-white rounded-2xl shadow-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                                <User className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-black text-sm uppercase tracking-tight">{selectedPersona.apellido}, {selectedPersona.nombre}</p>
                                                <p className="text-[9px] font-black uppercase tracking-widest opacity-60 italic">Identidad Validada • {selectedPersona.dni}</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedPersona(null)}
                                            className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                                        >
                                            Cambiar
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Especialidad</label>
                                    <select
                                        value={newTurno.especialidad}
                                        onChange={e => setNewTurno({ ...newTurno, especialidad: e.target.value })}
                                        className="input-sober"
                                    >
                                        <option>Clínica Médica</option>
                                        <option>Cardiología</option>
                                        <option>Pediatría</option>
                                        <option>Odontología</option>
                                        <option>Ginecología</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fecha y Hora</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={newTurno.fecha_hora}
                                        onChange={e => setNewTurno({ ...newTurno, fecha_hora: e.target.value })}
                                        className="input-sober"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Motivo / Notas</label>
                                <textarea
                                    rows={3}
                                    value={newTurno.nota}
                                    onChange={e => setNewTurno({ ...newTurno, nota: e.target.value })}
                                    placeholder="Detalles de la consulta..."
                                    className="input-sober resize-none"
                                />
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 text-xs font-black text-white uppercase tracking-widest bg-brand-navy rounded-2xl hover:shadow-xl transition-all"
                                >
                                    Confirmar Turno
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
