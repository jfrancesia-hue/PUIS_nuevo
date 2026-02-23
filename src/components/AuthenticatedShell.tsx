"use client";

import Navigation from "./Navigation";
import Link from "next/link";

export default function AuthenticatedShell({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* Provincial Header */}
            <header className="bg-[#0067b1] h-16 px-6 flex items-center justify-between sticky top-2 z-50 text-white shadow-lg">
                <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center font-black text-xs">
                        C
                    </div>
                    <div className="font-outfit">
                        <p className="text-sm font-black tracking-tight leading-none">Catamarca</p>
                        <p className="text-lg font-black tracking-tight leading-none uppercase">Gobierno</p>
                    </div>
                </Link>
                <div className="flex items-center gap-6">
                    <Link href="/ficha-unificada" className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center font-bold text-[10px] hover:bg-white/10 transition-colors">
                        Mi C
                    </Link>
                    <Link href="/busqueda" className="text-2xl hover:scale-110 transition-transform">🔍</Link>
                </div>
            </header>

            <Navigation />

            {/* Hero Section */}
            <div className="relative h-[240px] w-full overflow-hidden flex items-center justify-center bg-zinc-900 group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0067b1]/80 to-transparent z-10" />
                <div className="relative z-20 text-center space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black text-white font-outfit tracking-tighter uppercase drop-shadow-2xl">
                        MINISTERIO DE SALUD
                    </h1>
                    <p className="text-sky-200 text-sm font-black uppercase tracking-[0.3em] opacity-80">
                        Provincia de Catamarca
                    </p>
                </div>
                <div className="absolute inset-0 bg-cover bg-center opacity-40 grayscale group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop')" }} />
            </div>

            {/* Dark Secondary Nav */}
            <div className="bg-[#002b49] py-4 px-8 text-white flex items-center gap-8 text-sm font-black uppercase tracking-widest sticky top-[132px] z-30 shadow-md">
                <Link href="/" className="flex items-center gap-2 text-white">
                    <span>🏠</span> INICIO
                </Link>
                <span className="opacity-30">|</span>
                <Link href="/servicios" className="opacity-80 hover:opacity-100 transition-opacity">Guía de Servicios en Salud</Link>
            </div>

            <main className="flex-1 max-w-7xl mx-auto w-full p-8 md:p-12 animate-fade-in bg-white">
                {children}
            </main>

            <footer className="bg-[#002b49] py-12 px-8 text-white/60 text-xs font-bold mt-20">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col gap-2">
                        <p className="text-white text-lg font-black uppercase tracking-tighter">CATAMARCA GOBIERNO</p>
                        <p>© 2026 Ministerio de Salud - Todos los derechos reservados.</p>
                    </div>
                    <div className="flex gap-8 uppercase tracking-widest">
                        <a href="#" className="hover:text-white transition-colors">Contacto</a>
                        <a href="#" className="hover:text-white transition-colors">Términos</a>
                        <a href="#" className="hover:text-white transition-colors">Privacidad</a>
                    </div>
                </div>
            </footer>
        </>
    );
}
