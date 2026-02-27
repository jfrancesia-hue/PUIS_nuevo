'use client'

import { useState, useEffect } from 'react'
import { Turno, Persona } from '@/types'

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
            case 'realizado': return <span className="text-emerald-500">✅</span>
            case 'cancelado': return <span className="text-red-500">❌</span>
            case 'ausente': return <span className="text-amber-500">⚠️</span>
            default: return <span className="text-indigo-500">🕒</span>
        }
    }

    const specialties = ['Todas', ...Array.from(new Set(turnos.map(t => t.especialidad || 'Sin especialidad')))]

    const filteredTurnos = turnos.filter(t =>
        selectedSpecialty === 'Todas' || t.especialidad === selectedSpecialty
    )

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 font-outfit">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
                <div className="relative z-10">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
                        <span className="text-indigo-600">📅</span>
                        Gestión de Turnos
                    </h1>
                    <p className="text-slate-500 font-bold mt-2 text-xs uppercase tracking-widest">Agenda unificada y administración de citas médicas</p>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                    <div className="flex p-1 bg-slate-100 rounded-2xl">
                        <button
                            onClick={() => setView('lista')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${view === 'lista' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                        >
                            📋
                        </button>
                        <button
                            onClick={() => setView('calendario')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${view === 'calendario' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                        >
                            📅
                        </button>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-sm font-black shadow-lg shadow-indigo-100 transition-all active:scale-95 uppercase tracking-widest"
                    >
                        <span>+</span>
                        Nuevo Turno
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Filtros */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Especialidades Activas</label>
                            <div className="space-y-2">
                                {specialties.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setSelectedSpecialty(s)}
                                        className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-tight transition-all ${selectedSpecialty === s ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-inner' : 'text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-50">
                            <div className="p-4 rounded-2xl bg-slate-50 text-center">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Resumen Agenda</p>
                                <p className="text-2xl font-black text-slate-900 leading-none">{filteredTurnos.length}</p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Citas Programadas</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-slate-100 rounded-[32px] animate-pulse" />)}
                        </div>
                    ) : view === 'lista' ? (
                        <div className="space-y-4">
                            {filteredTurnos.length === 0 ? (
                                <div className="bg-white border-2 border-dashed border-slate-200 rounded-[40px] p-20 text-center">
                                    <span className="text-6xl grayscale opacity-20 block mb-4">📅</span>
                                    <h3 className="text-xl font-black text-slate-900 uppercase">Sin turnos registrados</h3>
                                    <p className="text-slate-500 mt-2 text-xs font-black uppercase tracking-widest">Los turnos para esta especialidad aparecerán aquí.</p>
                                </div>
                            ) : (
                                filteredTurnos.map(turno => (
                                    <div key={turno.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all flex items-center justify-between group overflow-hidden relative">
                                        <div className="flex items-center gap-6 relative z-10">
                                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 shadow-inner group-hover:bg-white transition-colors">
                                                <span className="text-[10px] font-black text-slate-300 uppercase leading-none">{new Date(turno.fecha_hora).toLocaleDateString('es', { month: 'short' })}</span>
                                                <span className="text-2xl font-black text-slate-900 leading-tight">{new Date(turno.fecha_hora).getDate()}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h3 className="font-black text-lg text-slate-900 uppercase tracking-tighter group-hover:text-indigo-600 transition-colors">
                                                        {(turno as any).personas?.nombre} {(turno as any).personas?.apellido}
                                                    </h3>
                                                    <span className="px-2 py-0.5 bg-slate-50 text-[9px] font-black text-slate-400 rounded-full border border-slate-100 uppercase">
                                                        DNI: {(turno as any).personas?.dni}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-[0.2em] opacity-60">
                                                    {turno.especialidad} • <span className="text-indigo-400 font-black">{turno.profesional || 'ASIGNANDO...'}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 relative z-10">
                                            <div className="text-right">
                                                <p className="text-xl font-black text-slate-900 leading-none">{new Date(turno.fecha_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                <div className="flex items-center gap-1.5 justify-end mt-2">
                                                    {getStatusIcon(turno.estado)}
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{turno.estado}</span>
                                                </div>
                                            </div>

                                            <div className="relative group/actions">
                                                <button className="w-10 h-10 bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600 flex items-center justify-center hover:bg-indigo-50 transition-all border border-slate-100">
                                                    ⋮
                                                </button>
                                                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl opacity-0 invisible group-hover/actions:opacity-100 group-hover/actions:visible transition-all z-20 overflow-hidden transform group-hover/actions:translate-y-0 translate-y-2 p-2 space-y-1">
                                                    {['programado', 'realizado', 'cancelado', 'ausente'].map(st => (
                                                        <button
                                                            key={st}
                                                            onClick={() => handleUpdateStatus(turno.id, st)}
                                                            className="w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-indigo-50 hover:text-indigo-600 rounded-xl"
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
                        <div className="bg-white p-20 rounded-[48px] border border-slate-100 shadow-sm text-center space-y-6 relative overflow-hidden">
                            <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-[2px] z-0" />
                            <div className="relative z-10">
                                <span className="text-7xl grayscale opacity-20 block mb-6">🗓️</span>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Calendario SIGESA v2.0</h3>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest max-w-sm mx-auto">Módulo de visualización avanzada en etapa de construcción para la próxima fase ministerial.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Nuevo Turno */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-[#002b49]/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[48px] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border-8 border-white/10">
                        <div className="p-10 border-b-2 border-dashed border-slate-100 flex justify-between items-center bg-slate-50/30">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-3">
                                <span className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-xl">+</span>
                                Agendar Cita
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-400 hover:text-slate-900 transition-all text-2xl">
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleCreateTurno} className="p-10 space-y-8">
                            {/* Buscador de Persona */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Validación de Paciente</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Ingrese DNI o Apellido para buscar..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value)
                                            searchPersonas(e.target.value)
                                        }}
                                        className="w-full pl-12 pr-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-[28px] text-lg font-black focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all shadow-inner placeholder:text-slate-300"
                                    />
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl opacity-30">🔍</span>
                                </div>

                                {searchResults.length > 0 && !selectedPersona && (
                                    <div className="bg-white border-2 border-slate-50 rounded-[32px] shadow-2xl max-h-56 overflow-y-auto mt-2 absolute w-[calc(100%-10rem)] z-30 p-2 space-y-1">
                                        {searchResults.map(p => (
                                            <button
                                                key={p.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedPersona(p)
                                                    setSearchTerm(`${p.apellido}, ${p.nombre}`)
                                                    setSearchResults([])
                                                }}
                                                className="w-full px-6 py-4 text-left hover:bg-slate-50 rounded-2xl flex justify-between items-center group transition-all"
                                            >
                                                <span className="text-sm font-black text-slate-700 uppercase">{p.apellido}, {p.nombre}</span>
                                                <span className="text-[10px] font-black text-slate-300 uppercase group-hover:text-indigo-400">DNI: {p.dni}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {selectedPersona && (
                                    <div className="flex items-center justify-between p-5 bg-indigo-600 text-white rounded-[28px] shadow-xl shadow-indigo-200">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl">
                                                👤
                                            </div>
                                            <div>
                                                <p className="font-black text-lg uppercase tracking-tight">{selectedPersona.apellido}, {selectedPersona.nombre}</p>
                                                <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 italic">Identidad Validada • {selectedPersona.dni}</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedPersona(null)}
                                            className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                                        >
                                            Cambiar
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Especialidad</label>
                                    <select
                                        value={newTurno.especialidad}
                                        onChange={e => setNewTurno({ ...newTurno, especialidad: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-[24px] p-5 text-sm font-black focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 shadow-inner appearance-none"
                                    >
                                        <option>Clínica Médica</option>
                                        <option>Cardiología</option>
                                        <option>Pediatría</option>
                                        <option>Odontología</option>
                                        <option>Ginecología</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Fecha y Hora</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={newTurno.fecha_hora}
                                        onChange={e => setNewTurno({ ...newTurno, fecha_hora: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-[24px] p-5 text-sm font-black focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 shadow-inner"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Motivo / Notas</label>
                                <textarea
                                    rows={2}
                                    value={newTurno.nota}
                                    onChange={e => setNewTurno({ ...newTurno, nota: e.target.value })}
                                    placeholder="Detalles de la consulta..."
                                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-[24px] p-5 text-sm font-black focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 shadow-inner resize-none placeholder:text-slate-300"
                                />
                            </div>

                            <div className="pt-6 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] bg-slate-100 rounded-[24px] hover:bg-slate-200 transition-all font-bold"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-6 text-[10px] font-black text-white uppercase tracking-[0.3em] bg-indigo-600 rounded-[24px] hover:bg-indigo-700 shadow-2xl shadow-indigo-100 transition-all font-bold"
                                >
                                    Agendar Turno ➔
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
