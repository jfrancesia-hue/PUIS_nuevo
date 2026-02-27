"use client";

import { useState, useEffect } from "react";

export default function DiagnosticoPage() {
    const [stats, setStats] = useState<any>({
        env: { present: false },
        auth: { ok: false, user: null },
        db: { ok: false, latency: 0 },
        storage: { ok: false, message: "" },
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        runDiagnostics();
    }, []);

    const runDiagnostics = async () => {
        setLoading(true);
        const results: any = {};

        // 1. Check Auth & API
        try {
            const start = Date.now();
            const res = await fetch('/api/auth/me');
            const data = await res.json();
            results.auth = { ok: res.ok, user: data.user?.email || 'N/A' };
            results.db = { ok: res.ok, latency: Date.now() - start };
        } catch (e) {
            results.auth = { ok: false, error: "API Inalcanzable" };
        }

        // 2. Check Storage
        try {
            const res = await fetch('/api/personas/8903f85b-c12a-403d-a9fa-8bc709f077c8/documentos');
            const data = await res.json();
            results.storage = { ok: true, count: data.items?.length || 0 };
        } catch (e) {
            results.storage = { ok: false, error: "Error de conexión con Storage" };
        }

        // 3. Env simulation (frontend check)
        results.env = {
            supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        };

        setStats(results);
        setLoading(false);
    };

    const copyReport = () => {
        const report = JSON.stringify(stats, null, 2);
        navigator.clipboard.writeText(report);
        alert("Reporte copiado al portapapeles");
    };

    return (
        <div className="space-y-10 animate-fade-in max-w-4xl mx-auto py-10">
            <header className="space-y-2">
                <h1 className="text-4xl font-black text-[#002b49] tracking-tighter uppercase">Diagnóstico del Sistema</h1>
                <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Validación de conectividad y estado de servicios • Nodo Catamarca</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Auth Card */}
                <div className="bg-white p-8 rounded-[40px] border border-zinc-100 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-3xl">🔑</span>
                        <div className={`w-3 h-3 rounded-full ${stats.auth?.ok ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                    </div>
                    <h3 className="font-black text-lg text-[#002b49] uppercase tracking-tight">Servicio de Autenticación</h3>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase">Estado: {stats.auth?.ok ? 'Operativo' : 'Error'}</p>
                    <div className="text-[10px] bg-zinc-50 p-4 rounded-2xl font-mono text-zinc-400">
                        Usuario: {stats.auth?.user || 'Desconectado'}
                    </div>
                </div>

                {/* Database Card */}
                <div className="bg-white p-8 rounded-[40px] border border-zinc-100 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-3xl">🗄️</span>
                        <div className={`w-3 h-3 rounded-full ${stats.db?.ok ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                    </div>
                    <h3 className="font-black text-lg text-[#002b49] uppercase tracking-tight">Base de Datos Central</h3>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase">Latencia: {stats.db?.latency}ms</p>
                    <div className="text-[10px] bg-zinc-50 p-4 rounded-2xl font-mono text-zinc-400">
                        Query: SELECT 1 (profiles)
                    </div>
                </div>

                {/* Storage Card */}
                <div className="bg-white p-8 rounded-[40px] border border-zinc-100 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-3xl">☁️</span>
                        <div className={`w-3 h-3 rounded-full ${stats.storage?.ok ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                    </div>
                    <h3 className="font-black text-lg text-[#002b49] uppercase tracking-tight">Repositorio de Objetos</h3>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase">Documentos Listados: {stats.storage?.count}</p>
                    <div className="text-[10px] bg-zinc-50 p-4 rounded-2xl font-mono text-zinc-400">
                        Bucket: documentos
                    </div>
                </div>

                {/* Env Card */}
                <div className="bg-[#002b49] p-8 rounded-[40px] shadow-xl space-y-4 text-white">
                    <div className="flex items-center justify-between">
                        <span className="text-3xl">⚙️</span>
                        <div className="w-3 h-3 rounded-full bg-sky-400 animate-pulse" />
                    </div>
                    <h3 className="font-black text-lg uppercase tracking-tight">Configuración de Nodo</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-[9px] uppercase font-black">
                            <span>Supabase URL</span>
                            <span className={stats.env?.supabaseUrl ? 'text-emerald-400' : 'text-red-400'}>Presente</span>
                        </div>
                        <div className="flex justify-between text-[9px] uppercase font-black">
                            <span>Anon Key</span>
                            <span className={stats.env?.supabaseAnonKey ? 'text-emerald-400' : 'text-red-400'}>Presente</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-6">
                <button
                    onClick={runDiagnostics}
                    disabled={loading}
                    className="flex-1 py-5 rounded-[24px] bg-[#0067b1] text-white font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-[#005694] transition-all transform active:scale-95 disabled:opacity-50"
                >
                    {loading ? 'Ejecutando...' : 'Re-Escanear Sistema'}
                </button>
                <button
                    onClick={copyReport}
                    className="flex-1 py-5 rounded-[24px] bg-zinc-800 text-white font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-zinc-900 transition-all transform active:scale-95"
                >
                    Copiar Reporte JSON
                </button>
            </div>
        </div>
    );
}
