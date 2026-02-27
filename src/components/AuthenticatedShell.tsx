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
        <div className="flex flex-col min-h-screen bg-brand-bg font-sans">
            <Navigation hideHeader />

            {/* Main Institutional Header */}
            <header className="bg-brand-navy text-white shadow-sm sticky top-0 z-[50]">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        {/* Burger Trigger */}
                        <button
                            onClick={() => {
                                const navBtn = document.querySelector('button[id="puis-nav-trigger"]');
                                if (navBtn) (navBtn as HTMLElement).click();
                            }}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <Link href="/" className="flex items-center gap-4 hover:opacity-90 transition-all">
                            <img
                                src="/brand/logo-ministerio.png"
                                alt="Ministerio de Salud"
                                className="h-10 object-contain brightness-0 invert"
                            />
                            <div className="hidden sm:block border-l border-white/20 pl-4">
                                <p className="text-xs font-bold leading-tight uppercase tracking-tight">Portal Unificado</p>
                                <p className="text-[10px] font-medium leading-tight opacity-70">Salud Catamarca</p>
                            </div>
                        </Link>

                        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider">
                            <Link href="/" className="hover:text-brand-accent transition-colors">Inicio</Link>
                            <Link href="/ficha-unificada" className="hover:text-brand-accent transition-colors">Ficha Unificada</Link>
                            <Link href="/turnos" className="hover:text-brand-accent transition-colors">Turnos</Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-3 pr-4 border-r border-white/10">
                            <div className="text-right">
                                <p className="text-[10px] font-bold uppercase tracking-wider">{profile?.nombre || 'Usuario'}</p>
                                <p className="text-[9px] font-medium text-white/60">
                                    {getRoleName(profile?.rol)}
                                </p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs border border-white/10">
                                <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                window.location.href = "/login";
                            }}
                            className="p-2 rounded-lg bg-red-500/20 text-red-200 hover:bg-red-500 hover:text-white transition-all border border-red-500/10"
                            title="Cerrar Sesión"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Breadcrumb / Status */}
            <div className="max-w-7xl mx-auto w-full px-6 py-3 flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                    <Link href="/" className="hover:text-brand-navy">Portal</Link>
                    <span>/</span>
                    <span className="text-slate-400">Gestión Clínica Digital</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Sincronizado
                </div>
            </div>

            {/* Content Area */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pb-20 animate-fade-in">
                {children}
            </main>

            {/* Global Footer */}
            <footer className="bg-white border-t mt-auto">
                <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <img src="/brand/logo-ministerio.png" className="h-6 object-contain opacity-40 grayscale" alt="" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gobierno de Catamarca</p>
                    </div>
                    <div className="flex gap-6 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        <a href="#" className="hover:text-brand-navy">Privacidad</a>
                        <a href="#" className="hover:text-brand-navy">Soporte IT</a>
                        <a href="#" className="hover:text-brand-navy">Términos</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
