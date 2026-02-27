"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Persona } from "@/types";

export default function Busqueda() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Persona[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (query.length < 3) {
            setResults([]);
            return;
        }

        const search = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/personas?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                if (data.ok) {
                    setResults(data.items || []);
                } else {
                    setResults([]);
                }
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(search, 300);
        return () => clearTimeout(timer);
    }, [query]);
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Search Header */}
            <section className="text-center max-w-2xl mx-auto space-y-4">
                <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 font-outfit">
                    Búsqueda <span className="gradient-text">Inteligente</span>
                </h1>
                <p className="text-zinc-500 font-medium">Encuentra pacientes, expedientes o turnos por cualquier criterio.</p>

                <div className="relative mt-8 group">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="DNI, Nombre, WhatsApp, Nro de Caso..."
                        className="w-full px-12 py-5 rounded-[32px] bg-white dark:bg-zinc-900 border-4 border-zinc-200 dark:border-zinc-800 focus:border-accent outline-none text-xl font-bold transition-all shadow-xl group-hover:shadow-2xl"
                    />
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-3xl">🔎</span>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 flex gap-2">
                        <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Normalizado
                        </div>
                        <button className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest">Avanzado</button>
                    </div>

                    {/* Real-time Validation Feedback */}
                    <div className="absolute -bottom-10 left-6 flex gap-4 text-[10px] font-bold">
                        <span className="text-emerald-500">✓ Formato DNI Válido</span>
                        <span className="text-red-500 flex items-center gap-1">⚠️ Registro Duplicado detectado</span>
                    </div>
                </div>
            </section>

            {/* Categories / Filters */}
            <div className="flex justify-center gap-3">
                {['Todo', 'Pacientes', 'Expedientes', 'Turnos', 'Documentos'].map((tab, i) => (
                    <button key={tab} className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${i === 0 ? 'bg-accent text-white shadow-lg' : 'bg-white dark:bg-zinc-900 border hover:border-accent'}`}>
                        {tab}
                    </button>
                ))}
            </div>

            {/* Results Section */}
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between pb-2 border-b">
                    <h2 className="font-outfit font-black uppercase text-zinc-400 text-xs tracking-[0.2em]">Resultados sugeridos</h2>
                    <span className="text-[10px] font-bold text-zinc-500">
                        {loading ? "Buscando..." : `Se encontraron ${results.length} coincidencias`}
                    </span>
                </div>

                {results.map((p) => (
                    <div key={p.id} className="p-6 rounded-[32px] border bg-white dark:bg-zinc-900/50 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-accent hover:shadow-2xl transition-all duration-300 group">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-medical-100 dark:bg-medical-800 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                                👤
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 font-outfit">{p.nombre} {p.apellido}</h3>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">Registrado</span>
                                </div>
                                <p className="text-sm font-bold text-zinc-500">
                                    DNI: <span className="text-zinc-900 dark:text-zinc-100 underline decoration-accent/40">{p.dni}</span> •
                                    Cel: <span className="text-zinc-900 dark:text-zinc-100">{p.telefono || "No registrado"}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Link href={`/ficha-unificada?id=${p.id}`}>
                                <button className="px-6 py-3 rounded-2xl bg-accent text-white text-xs font-black uppercase tracking-widest hover:shadow-xl active:scale-95 transition-all h-full">Abrir Ficha</button>
                            </Link>
                            <button className="px-4 py-3 rounded-2xl border text-emerald-600 border-emerald-500/30 hover:bg-emerald-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest">
                                💬 WhatsApp
                            </button>
                        </div>
                    </div>
                ))}

                {results.length === 0 && !loading && query.length >= 3 && (
                    <div className="text-center py-10">
                        <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">No se encontraron resultados para "{query}"</p>
                    </div>
                )}
            </div>
        </div>
    );
}
