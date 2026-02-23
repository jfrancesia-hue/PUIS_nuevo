"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems: { label: string, icon: string, href: string, className?: string, onClick?: () => void }[] = [
        { label: "Mi Perfil (Silvia Doe)", icon: "👤", href: "/ficha-unificada" },
        { label: "Configuración", icon: "⚙️", href: "#" },
        { label: "Mis Notificaciones", icon: "🔔", href: "/pendientes" },
        { label: "Centro: Hosp. San Juan", icon: "🏥", href: "/semaforo" },
        {
            label: "Cerrar Sesión",
            icon: "🚪",
            href: "/login",
            className: "text-red-600 mt-10 border-t pt-6",
            onClick: () => {
                localStorage.removeItem("puis_auth");
                window.location.href = "/login";
            }
        },
    ];

    return (
        <>
            {/* Global Nav Bar (White Background) */}
            <div className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-[80px] z-40">
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 hover:bg-zinc-100 rounded-lg transition-colors border shadow-sm"
                >
                    <svg className="w-6 h-6 text-[#0067b1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <div className="hidden md:flex items-center gap-6 text-sm font-bold text-zinc-600">
                    <Link href="/" className="hover:text-[#0067b1] transition-colors">INICIO</Link>
                    <Link href="/turnos" className="hover:text-[#0067b1] transition-colors">TURNOS</Link>
                    <Link href="/ficha-unificada" className="hover:text-[#0067b1] transition-colors">HISTORIAL</Link>
                    <Link href="/pendientes" className="hover:text-[#0067b1] transition-colors">GESTIÓN</Link>
                </div>
                <div className="text-[10px] font-black uppercase text-[#0067b1] tracking-widest bg-[#0067b1]/5 px-3 py-1 rounded-full border border-[#0067b1]/20">
                    Hosp. San Juan
                </div>
            </div>

            {/* Side Menu Drawer */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-[100] animate-fade-in"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="fixed top-0 left-0 h-full w-[300px] bg-white z-[110] shadow-2xl animate-slide-in-left p-8">
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-[#0067b1] text-white flex items-center justify-center font-black">
                                    S
                                </div>
                                <div>
                                    <p className="text-sm font-black text-zinc-900 leading-none uppercase">Silvia Doe</p>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Directora Técnica</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-zinc-400 hover:text-zinc-900 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            {menuItems.map((item, i) => (
                                <Link
                                    key={i}
                                    href={item.href}
                                    className={`flex items-center gap-4 p-4 rounded-2xl hover:bg-zinc-50 transition-all font-bold group ${item.className || 'text-zinc-600'}`}
                                    onClick={() => {
                                        if (item.onClick) item.onClick();
                                        setIsOpen(false);
                                    }}
                                >
                                    <span className="text-xl grayscale group-hover:grayscale-0 transition-all">{item.icon}</span>
                                    <span className="tracking-tight uppercase">{item.label}</span>
                                </Link>
                            ))}
                        </div>

                        <div className="absolute bottom-8 left-8 right-8">
                            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 italic text-[10px] text-zinc-400 leading-relaxed">
                                Versión 2.4.0 (Nodo Catamarca)<br />
                                Ministerio de Salud Provincial
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
