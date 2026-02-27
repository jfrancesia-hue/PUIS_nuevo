"use client";

import { useState } from "react";
import Link from "next/link";
import {
    User,
    Settings,
    Bell,
    Activity,
    Shield,
    Hospital,
    LogOut,
    FileSearch,
    LayoutDashboard
} from "lucide-react";

export default function Navigation({ hideHeader = false }: { hideHeader?: boolean }) {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems: { label: string, icon: any, href: string, className?: string, onClick?: () => void }[] = [
        { label: "Mi Perfil Gestión", icon: <User className="w-5 h-5" />, href: "/ficha-unificada" },
        { label: "Configuración de Nodo", icon: <Settings className="w-5 h-5" />, href: "#" },
        { label: "Alertas Ministeriales", icon: <Bell className="w-5 h-5" />, href: "/pendientes" },
        { label: "Semáforo Gestión", icon: <Activity className="w-5 h-5" />, href: "/semaforo" },
        { label: "Portal Transparencia", icon: <LayoutDashboard className="w-5 h-5" />, href: "/transparencia" },
        { label: "Auditoría Evidencia", icon: <Shield className="w-5 h-5" />, href: "/auditoria/evidencia" },
        { label: "Diagnóstico de Sistema", icon: <FileSearch className="w-5 h-5" />, href: "/gestion/diagnostico" },
        { label: "Centro Hospitalario", icon: <Hospital className="w-5 h-5" />, href: "/semaforo" },
        {
            label: "Salir del Sistema",
            icon: <LogOut className="w-5 h-5 text-red-500" />,
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
            {!hideHeader && (
                <div className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-[80px] z-40">
                    <button
                        id="puis-nav-trigger"
                        onClick={() => setIsOpen(true)}
                        className="p-2 hover:bg-zinc-100 rounded-lg transition-colors border shadow-sm"
                    >
                        <svg className="w-6 h-6 text-[#0067b1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="hidden md:flex items-center gap-6 text-sm font-bold text-zinc-600">
                        <Link href="/" className="hover:text-[#0067b1] transition-colors font-black uppercase text-[10px] tracking-widest">INICIO</Link>
                        <Link href="/turnos" className="hover:text-[#0067b1] transition-colors font-black uppercase text-[10px] tracking-widest">TURNOS</Link>
                        <Link href="/ficha-unificada" className="hover:text-[#0067b1] transition-colors font-black uppercase text-[10px] tracking-widest">HISTORIAL</Link>
                        <Link href="/pendientes" className="hover:text-[#0067b1] transition-colors font-black uppercase text-[10px] tracking-widest">GESTIÓN</Link>
                    </div>
                    <div className="text-[10px] font-black uppercase text-brand-navy tracking-widest bg-slate-50 px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
                        Hosp. San Juan
                    </div>
                </div>
            )}

            {/* Side Menu Drawer */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm z-[100] animate-fade-in"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="fixed top-0 left-0 h-full w-[320px] bg-white z-[110] shadow-2xl animate-slide-in-left p-8 border-r border-slate-200">
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-brand-navy text-white flex items-center justify-center font-black shadow-lg shadow-brand-navy/20">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-brand-navy leading-none uppercase tracking-tight">Personal Gestión</p>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Directorio Activo</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-400 hover:text-brand-navy transition-all"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-2">
                            {menuItems.map((item, i) => (
                                <Link
                                    key={i}
                                    href={item.href}
                                    className={`flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all font-bold group ${item.className || 'text-slate-600'}`}
                                    onClick={() => {
                                        if (item.onClick) item.onClick();
                                        setIsOpen(false);
                                    }}
                                >
                                    <span className="text-slate-400 group-hover:text-brand-navy transition-all">{item.icon}</span>
                                    <span className="tracking-tight uppercase text-[11px] font-black group-hover:translate-x-1 transition-transform">{item.label}</span>
                                </Link>
                            ))}
                        </div>

                        <div className="absolute bottom-8 left-8 right-8">
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 italic text-[9px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest mt-auto">
                                Versión 2.5.0 (Rebranding)<br />
                                Ministerio de Salud Catamarca
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
