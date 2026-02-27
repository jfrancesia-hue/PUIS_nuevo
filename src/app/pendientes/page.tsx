'use client'

import { useState, useEffect } from 'react'
import { Tarea, Persona } from '@/types'

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
            case 'alta': return 'bg-red-100 text-red-700 border-red-200'
            case 'media': return 'bg-amber-100 text-amber-700 border-amber-200'
            default: return 'bg-blue-100 text-blue-700 border-blue-200'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completada': return <span className="text-emerald-500">✅</span>
            case 'en_proceso': return <span className="text-blue-500">🕒</span>
            default: return <span className="text-slate-400">⚠️</span>
        }
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 font-outfit">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <span className="text-indigo-600">📥</span>
                        Bandeja Central de Tareas
                    </h1>
                    <p className="text-slate-500 mt-1 font-bold text-xs uppercase tracking-widest">Gestión institucional de solicitudes y pendientes</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <select
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
                        >
                            <option value="todos">Todos los Estados</option>
                            <option value="pendiente">Pendientes</option>
                            <option value="en_proceso">En Progreso</option>
                            <option value="completada">Completadas</option>
                        </select>
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs">🔍</span>
                    </div>

                    <button
                        onClick={() => setShowNewTask(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-black shadow-lg shadow-indigo-200 transition-all transform active:scale-95 uppercase tracking-widest"
                    >
                        <span>+</span>
                        Nueva Tarea
                    </button>
                </div>
            </div>

            {/* Grid de Tareas */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-48 bg-slate-50 rounded-2xl border border-slate-100 animate-pulse" />
                    ))}
                </div>
            ) : tareas.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                    <span className="text-5xl opacity-20 block mb-4">📥</span>
                    <h3 className="text-lg font-bold text-slate-900 uppercase">No hay tareas en esta bandeja</h3>
                    <p className="text-slate-500 max-w-xs mx-auto mt-2 text-xs font-bold uppercase tracking-widest">Las nuevas solicitudes aparecerán aquí una vez creadas.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tareas.map((tarea) => (
                        <div
                            key={tarea.id}
                            className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 relative overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 w-1.5 h-full ${tarea.prioridad === 'alta' ? 'bg-red-500' :
                                tarea.prioridad === 'media' ? 'bg-amber-500' : 'bg-blue-500'
                                }`} />

                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded">
                                    {tarea.tipo}
                                </span>
                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border ${getPriorityBadge(tarea.prioridad)}`}>
                                    {tarea.prioridad}
                                </span>
                            </div>

                            <h3 className="font-black text-slate-900 text-lg mb-2 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                                {tarea.titulo}
                            </h3>

                            <p className="text-slate-500 text-xs font-bold mb-4 line-clamp-2 italic opacity-80">
                                {tarea.descripcion || 'Sin descripción adicional.'}
                            </p>

                            {tarea.personas && (
                                <div className="flex items-center gap-2 mb-6 p-2 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-200 text-sm">
                                        👤
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-700 uppercase">{tarea.personas.nombre} {tarea.personas.apellido}</span>
                                        <span className="text-[9px] font-bold text-slate-400">DNI: {tarea.personas.dni}</span>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-1.5">
                                    {getStatusIcon(tarea.estado)}
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest capitalize">{tarea.estado.replace('_', ' ')}</span>
                                </div>

                                {tarea.estado !== 'completada' && (
                                    <button
                                        onClick={() => handleUpdateStatus(tarea.id, tarea.estado === 'pendiente' ? 'en_proceso' : 'completada')}
                                        className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest"
                                    >
                                        {tarea.estado === 'pendiente' ? 'Comenzar ➔' : 'Finalizar ✓'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Nueva Tarea */}
            {showNewTask && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border-4 border-indigo-50">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Crear Nueva Tarea</h2>
                            <button onClick={() => setShowNewTask(false)} className="text-slate-400 hover:text-slate-600 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-xl">
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleCreateTask} className="p-6 space-y-4">
                            {/* Buscador de Persona */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Persona Asociada (Opcional)</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Buscar por DNI o Nombre..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value)
                                            searchPersonas(e.target.value)
                                        }}
                                        className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 shadow-inner text-slate-900"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-40">🔎</span>
                                </div>

                                {searchResults.length > 0 && !selectedPersona && (
                                    <div className="bg-white border border-slate-200 rounded-2xl shadow-xl max-h-40 overflow-y-auto mt-1 absolute w-[calc(100%-3rem)] z-20 p-2 space-y-1">
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
                                                <span className="text-sm font-bold text-slate-700 uppercase">{p.apellido}, {p.nombre}</span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase">DNI: {p.dni}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {selectedPersona && (
                                    <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-2xl">
                                        <div className="flex items-center gap-2">
                                            <span className="text-indigo-500">✅</span>
                                            <span className="text-sm font-black text-indigo-800 uppercase tracking-tight">{selectedPersona.apellido}, {selectedPersona.nombre}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedPersona(null)}
                                            className="text-[10px] font-black text-indigo-400 hover:text-indigo-600 uppercase tracking-widest px-2 py-1 hover:bg-white rounded-lg transition-all"
                                        >
                                            Remover
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Prioridad</label>
                                        <select
                                            value={newTask.prioridad}
                                            onChange={e => setNewTask({ ...newTask, prioridad: e.target.value })}
                                            className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 shadow-inner appearance-none text-slate-900"
                                        >
                                            <option value="baja">Baja</option>
                                            <option value="media">Media</option>
                                            <option value="alta">Alta</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tipo</label>
                                        <select
                                            value={newTask.tipo}
                                            onChange={e => setNewTask({ ...newTask, tipo: e.target.value })}
                                            className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 shadow-inner appearance-none text-slate-900"
                                        >
                                            <option value="administrativo">Administrativo</option>
                                            <option value="medico">Médico</option>
                                            <option value="legal">Legal</option>
                                            <option value="otro">Otro</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Título de la Tarea</label>
                                    <input
                                        type="text"
                                        required
                                        value={newTask.titulo}
                                        onChange={e => setNewTask({ ...newTask, titulo: e.target.value })}
                                        placeholder="Ej: Revisión de expediente 452"
                                        className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 shadow-inner text-slate-900"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Descripción</label>
                                    <textarea
                                        rows={3}
                                        value={newTask.descripcion}
                                        onChange={e => setNewTask({ ...newTask, descripcion: e.target.value })}
                                        placeholder="Detalles adicionales..."
                                        className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 shadow-inner resize-none text-slate-900"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowNewTask(false)}
                                    className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all font-bold"
                                >
                                    Cerrar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 text-xs font-black text-white uppercase tracking-widest bg-indigo-600 rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all font-bold"
                                >
                                    Confirmar ➔
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
