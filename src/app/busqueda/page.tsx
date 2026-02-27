"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Persona } from "@/types";
import {
    Search,
    User,
    ChevronRight,
    Calendar,
    Fingerprint,
    Loader2,
    Users
} from "lucide-react";

export default function BusquedaPacientes() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<Persona[]>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (query.length < 3) return

        setLoading(true)
        try {
            const res = await fetch(`/api/personas/search?q=${encodeURIComponent(query)}`)
            const data = await res.json()
            if (data.ok) {
                setResults(data.items || [])
            } else {
                setResults([])
            }
        } catch (error) {
            console.error('Search error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSelectPersona = (id: string) => {
        router.push(`/ficha-unificada?id=${id}`)
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 font-outfit">
            {/* Header y Buscador Principal */}
            <div className="admin-card p-12 bg-white flex flex-col items-center text-center space-y-8">
                <div className="space-y-2">
                    <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-[20px] mx-auto border border-slate-100 text-brand-navy mb-4">
                        <Users className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-black text-brand-navy tracking-tight uppercase">Búsqueda de Pacientes</h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] max-w-md mx-auto leading-relaxed">
                        Acceso centralizado al Índice Maestro de Pacientes del Ministerio de Salud
                    </p>
                </div>

                <form onSubmit={handleSearch} className="w-full max-w-2xl relative group">
                    <div className="relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ingrese DNI, Apellido o Nombre del paciente..."
                            className="w-full pl-16 pr-32 py-5 bg-slate-50 border-2 border-slate-100 rounded-[28px] text-lg font-black text-brand-navy placeholder:text-slate-300 focus:border-brand-navy/30 focus:ring-8 focus:ring-brand-navy/5 outline-none transition-all shadow-inner group-hover:bg-white"
                        />
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-7 h-7 text-slate-300 group-focus-within:text-brand-navy transition-colors" />

                        <button
                            type="submit"
                            disabled={loading}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-brand-navy text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-navy/90 active:scale-95 transition-all flex items-center gap-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Buscar'}
                        </button>
                    </div>
                    {query.length > 0 && query.length < 3 && (
                        <p className="absolute -bottom-6 left-6 text-[9px] font-black text-amber-500 uppercase tracking-widest animate-pulse">
                            Mínimo 3 caracteres para iniciar la búsqueda
                        </p>
                    )}
                </form>
            </div>

            {/* Resultados de Búsqueda */}
            {results.length > 0 && (
                <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                            Resultados Encontrados ({results.length})
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {results.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => handleSelectPersona(p.id)}
                                className="group admin-card bg-white p-6 flex items-center justify-between hover:border-brand-navy/40 transition-all duration-300 text-left border-slate-200"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-brand-navy group-hover:bg-brand-navy group-hover:text-white transition-all border border-slate-100 shadow-sm">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-black text-brand-navy uppercase tracking-tight group-hover:translate-x-1 transition-transform">
                                            {p.apellido}, {p.nombre}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                            <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                <Fingerprint className="w-3 h-3 text-slate-300" />
                                                DNI {p.dni}
                                            </span>
                                            {p.fecha_nacimiento && (
                                                <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                    <Calendar className="w-3 h-3 text-slate-300" />
                                                    {new Date(p.fecha_nacimiento).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-brand-navy/10 group-hover:text-brand-navy transition-all">
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Estado Vacío */}
            {!loading && results.length === 0 && query.length >= 3 && (
                <div className="p-20 text-center bg-white border-2 border-dashed border-slate-100 rounded-[40px] animate-in fade-in duration-700">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="text-lg font-black text-brand-navy uppercase tracking-widest">Sin coincidencias</h3>
                    <p className="text-slate-400 mt-2 text-xs font-bold uppercase tracking-[0.2em]">Intente con otros términos de búsqueda</p>
                </div>
            )}
        </div>
    )
}
