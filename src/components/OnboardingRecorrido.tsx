"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function OnboardingRecorrido() {
    const [steps, setSteps] = useState([
        { id: 'session', label: 'Sesión Activa', description: 'Acceso ministerial validado', verified: false, href: '/login', actionLabel: 'Ir a Login' },
        { id: 'ficha', label: 'Abrir Ficha', description: 'Seleccionar un paciente real', verified: false, href: '/ficha-unificada', actionLabel: 'Ir a Ficha' },
        { id: 'list', label: 'Listar Documentos', description: 'Consultar repositorio oficial', verified: false, href: '/ficha-unificada', actionLabel: 'Ver Documentos' },
        { id: 'upload', label: 'Subir Archivo', description: 'Digitalizar documento real', verified: false, href: '/ficha-unificada', actionLabel: 'Subir PDF' },
        { id: 'download', label: 'Descargar Archivo', description: 'Verificar integridad de storage', verified: false, href: '/ficha-unificada', actionLabel: 'Abrir Archivo' },
    ]);

    useEffect(() => {
        const updateSteps = () => {
            const auth = localStorage.getItem('puis_auth');
            const hasId = localStorage.getItem('puis_last_persona_id');
            const hasList = localStorage.getItem('puis_step_docs_listed');
            const hasUpload = localStorage.getItem('puis_step_docs_uploaded');
            const hasDownload = localStorage.getItem('puis_step_docs_downloaded');

            setSteps(prev => prev.map(s => {
                if (s.id === 'session') return { ...s, verified: !!auth };
                if (s.id === 'ficha') return { ...s, verified: !!hasId };
                if (s.id === 'list') return { ...s, verified: !!hasList };
                if (s.id === 'upload') return { ...s, verified: !!hasUpload };
                if (s.id === 'download') return { ...s, verified: !!hasDownload };
                return s;
            }));
        };

        updateSteps();
        window.addEventListener('storage', updateSteps);
        const interval = setInterval(updateSteps, 2000);
        return () => {
            window.removeEventListener('storage', updateSteps);
            clearInterval(interval);
        };
    }, []);

    const allComplete = steps.every(s => s.verified);

    return (
        <section className="bg-white rounded-[48px] p-10 border border-zinc-100 shadow-xl space-y-8 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 ${allComplete ? 'bg-emerald-500/10' : 'bg-[#0067b1]/5'} rounded-full -mr-16 -mt-16 transition-colors`} />

            <div className="flex items-center justify-between relative z-10">
                <div>
                    <h2 className="text-2xl font-black text-[#002b49] tracking-tighter uppercase">Recorrido de Primer Uso</h2>
                    <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mt-1 italic">Complete los pasos para validar su operatividad en el nodo</p>
                </div>
                {allComplete && (
                    <div className="px-5 py-2 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-[0.2em] animate-bounce">
                        Sistema Operativo OK
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {steps.map((step, i) => (
                    <div key={step.id} className={`p-6 rounded-3xl border ${step.verified ? 'bg-emerald-50 border-emerald-100' : 'bg-zinc-50 border-zinc-100'} transition-all flex flex-col justify-between gap-6`}>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-zinc-300">0{i + 1}</span>
                                {step.verified ? (
                                    <span className="text-emerald-500 text-lg">✅</span>
                                ) : (
                                    <span className="w-2 h-2 rounded-full bg-zinc-200 animate-pulse" />
                                )}
                            </div>
                            <h4 className={`font-black text-xs uppercase tracking-tight ${step.verified ? 'text-emerald-900' : 'text-zinc-900'}`}>
                                {step.label}
                            </h4>
                            <p className="text-[9px] font-bold text-zinc-400 leading-tight">
                                {step.description}
                            </p>
                        </div>
                        {!step.verified && (
                            <Link href={step.href} className="text-[9px] font-black uppercase tracking-widest text-[#0067b1] hover:underline flex items-center gap-1">
                                {step.actionLabel} →
                            </Link>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
