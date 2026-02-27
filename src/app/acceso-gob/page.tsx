"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LegacyLogin() {
    const [step, setStep] = useState(1);
    const [scanning, setScanning] = useState(false);
    const [progress, setProgress] = useState(0);
    const router = useRouter();

    const startScan = () => {
        setScanning(true);
        let p = 0;
        const interval = setInterval(() => {
            p += 5;
            setProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                setScanning(false);
                setStep(3);
                setTimeout(() => {
                    router.push("/");
                }, 1500);
            }
        }, 100);
    };

    return (
        <div className="min-h-screen bg-[#002b49] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
            <div className="absolute top-4 left-4 z-50">
                <div className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full animate-pulse uppercase tracking-widest">
                    Vista Legacy - No genera sesión real
                </div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-10 space-y-4">
                    <h1 className="text-4xl font-black text-white font-outfit tracking-tighter uppercase">
                        PUIS <span className="text-[#f9b000]">CATAMARCA</span>
                    </h1>
                    <p className="text-sky-200/60 text-xs font-bold uppercase tracking-widest italic">
                        Legacy Biometric PIN Interface
                    </p>
                </div>

                <div className="bg-white rounded-[40px] shadow-2xl p-10 relative overflow-hidden group text-center">
                    {step === 1 && (
                        <div className="space-y-8">
                            <h2 className="text-2xl font-black text-[#002b49] font-outfit uppercase">Acceso PIN</h2>
                            <button
                                onClick={() => setStep(2)}
                                className="w-full py-5 bg-[#0067b1] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs"
                            >Iniciar Validación ➔</button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-fade-in text-center space-y-10">
                            <div className="relative group/scan flex flex-col items-center">
                                <button
                                    onClick={startScan}
                                    disabled={scanning}
                                    className={`w-32 h-40 rounded-3xl border-4 ${scanning ? 'border-[#f9b000]' : 'border-zinc-200'} bg-zinc-50 flex items-center justify-center relative overflow-hidden transition-all shadow-inner`}
                                >
                                    <span className="text-5xl">☝️</span>
                                    {scanning && (
                                        <>
                                            <div className="absolute top-0 left-0 w-full h-1 bg-[#f9b000] shadow-[0_0_15px_#f9b000] z-20" style={{ top: `${progress}%` }} />
                                            <div className="absolute inset-0 bg-[#f9b000]/10 z-10" />
                                        </>
                                    )}
                                </button>
                                <p className="mt-6 text-[10px] font-black text-zinc-400 tracking-[0.2em] uppercase">
                                    {scanning ? 'Escaneando...' : 'Toque el sensor'}
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-fade-in text-center py-10 space-y-6">
                            <div className="w-24 h-24 rounded-full bg-emerald-500 text-white flex items-center justify-center text-5xl mx-auto">✓</div>
                            <h2 className="text-3xl font-black text-[#002b49] font-outfit uppercase">Validado</h2>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
