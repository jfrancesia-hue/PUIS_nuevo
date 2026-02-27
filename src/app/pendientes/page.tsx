'use client'

import { useState, useEffect } from 'react'
import { Tarea, Persona } from '@/types'

import {
    Inbox,
    Plus,
    Search,
    CheckCircle2,
    Clock,
    AlertCircle,
    User,
    Tag,
    MoreVertical,
    XCircle,
    AlertTriangle,
    ChevronRight,
    Filter
} from "lucide-react";

export default function BandejaPendientes() {
    const [tareas, setTareas] = useState<Tarea[]>([])
    const [loading, setLoading] = useState(true)
    const [filtroEstado, setFiltroEstado] = useState('pendiente')
    const [showNewTask, setShowNewTask] = useState(false)

    // New Task state
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState<Persona[]>([])
    const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)
    const [newTask, setNewTask] = useState({
        titulo: '',
        descripcion: '',
        tipo: 'administrativo',
        prioridad: 'media'
    })

    useEffect(() => {
        fetchTareas()
    }, [filtroEstado])

    const fetchTareas = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/bandeja?estado=${filtroEstado}`)
            const data = await res.json()
            if (data.ok) {
                setTareas(data.items || [])
            }
        } catch (error) {
            console.error('Error fetching tasks:', error)
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

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/bandeja', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newTask,
                    persona_id: selectedPersona?.id
                })
            })
            const data = await res.json()
            if (data.ok) {
                setShowNewTask(false)
                setNewTask({ titulo: '', descripcion: '', tipo: 'administrativo', prioridad: 'media' })
                setSelectedPersona(null)
                setSearchTerm('')
                fetchTareas()
            } else {
                alert(data.error || 'Error al crear tarea')
            }
        } catch (error) {
            console.error('Error creating task:', error)
        }
    }

    const handleUpdateStatus = async (id: string, nuevoEstado: string) => {
        try {
            const res = await fetch(`/api/bandeja/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: nuevoEstado })
            })
            const data = await res.json()
            if (data.ok) {
                fetchTareas()
            }
        } catch (error) {
            console.error('Error updating status:', error)
        }
    }

    const getPriorityBadge = (prio: string) => {
        switch (prio) {
            case 'alta': return 'bg-red-50 text-red-600 border-red-100'
            case 'media': return 'bg-amber-50 text-amber-600 border-amber-100'
            default: return 'bg-blue-50 text-blue-600 border-blue-100'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completada': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            case 'en_proceso': return <Clock className="w-4 h-4 text-blue-500" />
            default: return <AlertCircle className="w-4 h-4 text-slate-400" />
        }
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 font-outfit">
            {/* Header Institucional */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 admin-card p-8 bg-white border-slate-200">
                <div>
                    <h1 className="text-2xl font-black text-brand-navy tracking-tight flex items-center gap-3">
                        <Inbox className="w-8 h-8 text-brand-navy" />
                        Bandeja de Tareas
                    </h1>
                    <p className="text-slate-500 font-bold mt-1 text-[10px] uppercase tracking-widest">Gestión de trámites y solicitudes ministeriales</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <select
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                            className="pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-tight focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy outline-none appearance-none cursor-pointer group hover:bg-white transition-all text-brand-navy"
                        >
                            <option value="todos">Todos los Estados</option>
                            <option value="pendiente">Pendientes</option>
                            <option value="en_proceso">En Progreso</option>
                            <option value="completada">Completadas</option>
                        </select>
                        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>

                    <button
                        onClick={() => setShowNewTask(true)}
                        className="btn-primary flex items-center gap-2 px-6 py-2.5"
                    >
                        <Plus className="w-4 h-4" />
                        Nueva Tarea
                    </button>
                </div>
            </div>

            {/* Grid de Tareas */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-48 bg-slate-50 rounded-2xl animate-pulse border border-slate-100" />
                    ))}
                </div>
            ) : tareas.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-[32px] p-20 text-center">
                    <Inbox className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-lg font-black text-slate-900 uppercase">Bandeja Vacía</h3>
                    <p className="text-slate-500 mt-2 text-xs font-bold uppercase tracking-widest">No hay tareas que coincidan con el filtro seleccionado</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tareas.map((tarea) => (
                        <div
                            key={tarea.id}
                            className="group admin-card bg-white border-slate-200 p-6 hover:border-brand-navy/30 transition-all duration-300 relative overflow-hidden flex flex-col h-full"
                        >
                            <div className={`absolute top-0 right-0 w-1.5 h-full ${tarea.prioridad === 'alta' ? 'bg-red-500' :
                                tarea.prioridad === 'media' ? 'bg-amber-500' : 'bg-blue-500'
                                }`} />

                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                    {tarea.tipo}
                                </span>
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded border ${getPriorityBadge(tarea.prioridad)}`}>
                                    {tarea.prioridad}
                                </span>
                            </div>

                            <h3 className="font-black text-slate-900 text-lg mb-2 group-hover:text-brand-navy transition-colors uppercase tracking-tight leading-tight">
                                {tarea.titulo}
                            </h3>

                            <p className="text-slate-500 text-xs font-bold mb-6 line-clamp-2 italic opacity-80 leading-relaxed">
                                {tarea.descripcion || 'Sin descripción adicional.'}
                            </p>

                            {tarea.personas && (
                                <div className="flex items-center gap-3 mb-6 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-200 text-brand-navy shadow-sm">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-brand-navy uppercase tracking-tight">{tarea.personas.nombre} {tarea.personas.apellido}</span>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">DNI: {tarea.personas.dni}</span>
                                    </div>
                                </div>
                            )}

                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(tarea.estado)}
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{tarea.estado.replace('_', ' ')}</span>
                                </div>

                                {tarea.estado !== 'completada' && (
                                    <button
                                        onClick={() => handleUpdateStatus(tarea.id, tarea.estado === 'pendiente' ? 'en_proceso' : 'completada')}
                                        className="text-[10px] font-black text-brand-navy hover:text-brand-navy/70 uppercase tracking-widest flex items-center gap-1.5 transition-all"
                                    >
                                        {tarea.estado === 'pendiente' ? 'Comenzar' : 'Finalizar'}
                                        <ChevronRight className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Nueva Tarea */}
            {showNewTask && (
                <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20">
                        <div className="p-8 border-b-2 border-dashed border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-2xl font-black text-brand-navy tracking-tight uppercase flex items-center gap-3">
                                <Plus className="w-6 h-6 p-1 bg-brand-navy text-white rounded-lg" />
                                Nueva Tarea
                            </h2>
                            <button onClick={() => setShowNewTask(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:text-brand-navy hover:bg-white transition-all text-xl">
                                <Plus className="rotate-45" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateTask} className="p-8 space-y-6">
                            {/* Buscador de Persona */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Persona Asociada (Opcional)</label>
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
                                    <div className="bg-white border-2 border-slate-100 rounded-2xl shadow-2xl max-h-40 overflow-y-auto mt-1 absolute w-[calc(100%-4rem)] z-[110] p-2 space-y-1">
                                        {searchResults.map(p => (
                                            <button
                                                key={p.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedPersona(p)
                                                    setSearchTerm(`${p.apellido}, ${p.nombre}`)
                                                    setSearchResults([])
                                                }}
                                                className="w-full px-4 py-3 text-left hover:bg-slate-50 rounded-xl flex justify-between items-center group transition-all"
                                            >
                                                <span className="text-sm font-black text-slate-700 uppercase">{p.apellido}, {p.nombre}</span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase">DNI: {p.dni}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {selectedPersona && (
                                    <div className="flex items-center justify-between p-4 bg-brand-navy text-white rounded-2xl shadow-lg">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-sky-400" />
                                            <span className="text-sm font-black uppercase tracking-tight">{selectedPersona.apellido}, {selectedPersona.nombre}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedPersona(null)}
                                            className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                                        >
                                            Remover
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prioridad</label>
                                        <select
                                            value={newTask.prioridad}
                                            onChange={e => setNewTask({ ...newTask, prioridad: e.target.value })}
                                            className="input-sober"
                                        >
                                            <option value="baja">Baja</option>
                                            <option value="media">Media</option>
                                            <option value="alta">Alta</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo</label>
                                        <select
                                            value={newTask.tipo}
                                            onChange={e => setNewTask({ ...newTask, tipo: e.target.value })}
                                            className="input-sober"
                                        >
                                            <option value="administrativo">Administrativo</option>
                                            <option value="medico">Médico</option>
                                            <option value="legal">Legal</option>
                                            <option value="otro">Otro</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Título de la Tarea</label>
                                    <input
                                        type="text"
                                        required
                                        value={newTask.titulo}
                                        onChange={e => setNewTask({ ...newTask, titulo: e.target.value })}
                                        placeholder="Ej: Revisión de expediente 452"
                                        className="input-sober"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descripción</label>
                                    <textarea
                                        rows={3}
                                        value={newTask.descripcion}
                                        onChange={e => setNewTask({ ...newTask, descripcion: e.target.value })}
                                        placeholder="Detalles adicionales..."
                                        className="input-sober resize-none"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowNewTask(false)}
                                    className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all"
                                >
                                    Cerrar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 text-xs font-black text-white uppercase tracking-widest bg-brand-navy rounded-2xl hover:shadow-xl transition-all"
                                >
                                    Confirmar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
