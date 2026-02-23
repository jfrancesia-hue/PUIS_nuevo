"use client";

import { useState, useEffect } from "react";

export default function Onboarding() {
    const [isVisible, setIsVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding_v3");
        if (!hasSeenOnboarding) {
            setIsVisible(true);
        }
    }, []);

    const steps = [
        {
            title: "¡Bienvenida Silvia!",
            desc: "Este es tu nuevo centro de comando. 'Tu Centro al Día' prioriza lo urgente para que gestiones con máxima agilidad.",
            target: "🎯"
        },
        {
            title: "Semáforo Real",
            desc: "Monitorea el estado de toda la red provincial. Los centros en rojo requieren tu atención inmediata.",
            target: "🚦"
        },
        {
            title: "IA Administrativa",
            desc: "Usa el asistente inteligente para predecir crisis y optimizar recursos sin moverte de tu escritorio.",
            target: "🧠"
        }
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleClose();
        }
    };

    const handleClose = () => {
        localStorage.setItem("hasSeenOnboarding_v3", "true");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/80 backdrop-blur-md animate-fade-in">
            <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-[40px] shadow-2xl overflow-hidden border border-white/10 relative">
                {/* Decorative Background */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-accent to-secondary opacity-10" />

                <div className="p-10 relative">
                    <div className="flex justify-between items-start mb-8">
                        <div className="w-16 h-16 rounded-3xl bg-accent text-white flex items-center justify-center text-3xl shadow-xl animate-bounce">
                            {steps[currentStep].target}
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 font-bold text-xs uppercase tracking-widest transition-colors"
                        >
                            Saltar
                        </button>
                    </div>

                    <div className="space-y-6 min-h-[160px]">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest">
                            Paso {currentStep + 1} de {steps.length}
                        </div>
                        <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 font-outfit leading-tight">
                            {steps[currentStep].title}
                        </h2>
                        <p className="text-zinc-500 font-medium leading-relaxed">
                            {steps[currentStep].desc}
                        </p>
                    </div>

                    <div className="mt-12 flex items-center justify-between">
                        <div className="flex gap-2">
                            {steps.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-accent' : 'w-2 bg-zinc-200 dark:bg-zinc-800'}`}
                                />
                            ))}
                        </div>
                        <button
                            onClick={handleNext}
                            className="px-8 py-4 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-2xl font-black uppercase tracking-tighter text-sm hover:shadow-xl active:scale-95 transition-all shadow-lg"
                        >
                            {currentStep === steps.length - 1 ? "Empezar" : "Siguiente →"}
                        </button>
                    </div>
                </div>

                {/* Visual Pointer Example (Simulated) */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
            </div>
        </div>
    );
}
