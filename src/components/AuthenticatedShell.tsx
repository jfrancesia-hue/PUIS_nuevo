"use client";

import Navigation from "./Navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function AuthenticatedShell({ children }: { children: React.ReactNode }) {
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/profile/me');
            const data = await res.json();
            if (data.ok) {
                setProfile(data.profile);
            }
        } catch (err) {
            console.error("Shell profile error:", err);
        }
    };

    const getRoleName = (rol: string) => {
        switch (rol) {
            case 'admin': return 'Administrador';
            case 'profesional': return 'Profesional Salud';
            case 'administrativo': return 'Aux. Administrativo';
            default: return 'Usuario Salud';
        }
    };
    return (
        <div className="flex flex-col min-h-screen bg-zinc-50 font-outfit">
            <Navigation hideHeader />

            {/* Main Institutional Header */}
            <header className="bg-[#002b49] text-white shadow-xl sticky top-2 z-[50] mx-4 my-2 rounded-3xl border border-white/10 backdrop-blur-md overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0067b1]/20 to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                        {/* Burger Trigger */}
                        <button
                            onClick={() => {
                                const navBtn = document.querySelector('button[id="puis-nav-trigger"]');
                                if (navBtn) (navBtn as HTMLElement).click();
                                else {
                                    alert("Menú Lateral en mantenimiento");
                                }
                            }}
                            className="p-2 hover:bg-white/10 rounded-xl transition-colors border border-white/10 shadow-inner"
                        >
                            <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-all active:scale-95 border-l border-white/10 pl-4">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-black text-[#0067b1] text-lg shadow-inner">
                                C
                            </div>
                            <div>
                                <p className="text-[10px] font-black tracking-[0.2em] leading-none opacity-60 uppercase">Catamarca</p>
                                <p className="text-xl font-black tracking-tighter leading-none uppercase">Ministerio de Salud</p>
                            </div>
                        </Link>

                        <nav className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em]">
                            <Link href="/" className="hover:text-[#f9b000] transition-colors">Inicio</Link>
                            <Link href="/ficha-unificada" className="hover:text-[#f9b000] transition-colors">Ficha Unificada</Link>
                            <Link href="/turnos" className="hover:text-[#f9b000] transition-colors">Turnos</Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-3 pr-6 border-r border-white/10">
                            <div className="text-right">
                                <p className="text-[9px] font-black uppercase tracking-widest opacity-40">{profile?.nombre || 'Usuario Nodo-8'}</p>
                                <p className="text-[11px] font-black uppercase tracking-tight text-sky-400">
                                    {getRoleName(profile?.rol)}
                                </p>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm border border-white/5">
                                🛡️
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                window.location.href = "/login";
                            }}
                            className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center text-sm border border-red-500/20 active:scale-90"
                            title="Cerrar Sesión"
                        >
                            🚪
                        </button>
                    </div>
                </div>
            </header>

            {/* Breadcrumb / Sub-Nav */}
            <div className="px-10 py-4 flex items-center gap-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest overflow-x-auto whitespace-nowrap">
                <Link href="/" className="hover:text-[#0067b1]">Portal</Link>
                <span>/</span>
                <span className="text-zinc-600">Gestión Clínica Digital</span>
                <div className="flex-1" />
                <div className="flex items-center gap-3 text-[#0067b1]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Sincronizado con Nodo Central
                </div>
            </div>

            {/* Content Area */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pb-20 animate-fade-in">
                {children}
            </main>

            {/* Global Footer */}
            <footer className="bg-white border-t py-12 px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-4 grayscale opacity-50">
                        <div className="w-10 h-10 rounded-full bg-zinc-200" />
                        <div className="text-left font-outfit">
                            <p className="text-zinc-500 font-black text-xs leading-none">Catamarca</p>
                            <p className="text-zinc-900 font-black text-lg leading-none uppercase tracking-tighter">Gobierno</p>
                        </div>
                    </div>
                    <div className="flex gap-10 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        <a href="#" className="hover:text-[#0067b1]">Políticas de Privacidad</a>
                        <a href="#" className="hover:text-[#0067b1]">Ayuda Técnica</a>
                        <a href="#" className="hover:text-[#0067b1]">Terminos de Uso</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
