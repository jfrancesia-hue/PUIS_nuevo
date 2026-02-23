"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Login() {
    const [step, setStep] = useState(1); // 1: Credentials, 2: Biometric, 3: Success
    const [scanning, setScanning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError(authError.message);
            return;
        }

        setStep(2);
    };

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
            {/* Background patterns */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,103,177,0.2)_0%,transparent_70%)]" />
                <div className="grid grid-cols-12 h-full w-full">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="border-r border-white/5 h-full" />
                    ))}
                </div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Institutional Branding */}
                <div className="text-center mb-10 space-y-4">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                        <div className="w-6 h-6 rounded-full bg-[#f9b000] flex items-center justify-center font-black text-[10px] text-[#002b49]">C</div>
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Ministerio de Salud • Nodo Seguro</span>
                    </div>
                    <h1 className="text-4xl font-black text-white font-outfit tracking-tighter uppercase">
                        PUIS <span className="text-[#f9b000]">CATAMARCA</span>
                    </h1>
                    <p className="text-sky-200/60 text-xs font-bold uppercase tracking-widest italic">
                        Plataforma Unificada de Información en Salud
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-[40px] shadow-2xl p-10 relative overflow-hidden group">
                    {step === 1 && (
                        <div className="animate-fade-in space-y-8">
                            <div className="text-center">
                                <h2 className="text-2xl font-black text-[#002b49] font-outfit uppercase">Acceso Restringido</h2>
                                <p className="text-zinc-400 text-xs font-bold mt-1 uppercase tracking-widest">Ingrese sus credenciales de red</p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-5">
                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase rounded-xl">
                                        ⚠️ {error}
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-4">Usuario Gubernamental</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="ej: silvia.doe@catamarca.gov.ar"
                                        className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-[#0067b1] focus:ring-4 focus:ring-[#0067b1]/10 outline-none transition-all font-bold text-zinc-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-4">Contraseña PIN</label>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-[#0067b1] focus:ring-4 focus:ring-[#0067b1]/10 outline-none transition-all font-bold text-zinc-900"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-5 bg-[#0067b1] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-[#005694] transition-all shadow-xl active:scale-95"
                                >
                                    Siguiente Paso ➔
                                </button>
                            </form>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-fade-in text-center space-y-10">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black text-[#002b49] font-outfit uppercase">Verificación Biométrica</h2>
                                <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Coloque su huella en el sensor</p>
                            </div>

                            <div className="relative group/scan flex flex-col items-center">
                                <button
                                    onClick={startScan}
                                    disabled={scanning}
                                    className={`w-32 h-40 rounded-3xl border-4 ${scanning ? 'border-[#f9b000]' : 'border-zinc-200'} bg-zinc-50 flex items-center justify-center relative overflow-hidden transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-inner`}
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        className={`w-20 h-20 ${scanning ? 'text-[#f9b000]' : 'text-zinc-300'} transition-colors`}
                                    >
                                        <path d="M12 2a10 10 0 0 0-10 10c0 1 .1 1.9.3 2.8.3 1.3 1.1 2.3 2.1 3.1M22 12c0-5.5-4.5-10-10-10M4.4 17.9c.4.3.9.5 1.4.7M9.2 21.6c.9.3 1.8.4 2.8.4 5.5 0 10-4.5 10-10M12 8v4M12 16h.01" strokeLinecap="round" />
                                        <path d="M15 8c0-1.7-1.3-3-3-3s-3 1.3-3 3v4c0 1.7 1.3 3 3 3s3-1.3 3-3V8z" />
                                        <path d="M12 11V8M12 11h3l-3 3-3-3h3z" />
                                        <path d="M7 11.5c.5-1.5 2-2.5 3.5-2.5s3 1 3.5 2.5" />
                                        <path d="M5 13.5c.5-2.5 3-4.5 5.5-4.5s5 2 5.5 4.5" />
                                        {/* Fake fingerprint lines */}
                                        <path d="M12 18c-3 0-5.5-2.5-5.5-5.5S9 7 12 7s5.5 2.5 5.5 5.5S15 18 12 18z" strokeWidth="0.5" opacity="0.2" />
                                    </svg>

                                    {scanning && (
                                        <>
                                            <div
                                                className="absolute top-0 left-0 w-full h-1 bg-[#f9b000] shadow-[0_0_15px_#f9b000] z-20"
                                                style={{ top: `${progress}%` }}
                                            />
                                            <div className="absolute inset-0 bg-[#f9b000]/10 z-10" />
                                        </>
                                    )}
                                </button>

                                {scanning && (
                                    <p className="mt-6 text-[10px] font-black text-[#f9b000] animate-pulse tracking-[0.3em] uppercase">Escaneando...</p>
                                )}
                                {!scanning && (
                                    <p className="mt-6 text-[10px] font-black text-zinc-400 tracking-[0.2em] uppercase">Toque para iniciar</p>
                                )}
                            </div>

                            <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#f9b000] transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-fade-in text-center py-10 space-y-6">
                            <div className="w-24 h-24 rounded-full bg-emerald-500 text-white flex items-center justify-center text-5xl mx-auto shadow-xl shadow-emerald-500/20 animate-bounce">
                                ✓
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black text-[#002b49] font-outfit uppercase">Identidad Validada</h2>
                                <p className="text-zinc-400 text-xs font-bold uppercase tracking-[0.2em]">Bienvenido, Silvia Doe</p>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#0067b1] animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 rounded-full bg-[#0067b1] animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 rounded-full bg-[#0067b1] animate-bounce"></div>
                            </div>
                        </div>
                    )}

                    {/* Decorative corner accent */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#f9b000]/5 rounded-bl-full -tr-10" />
                </div>

                {/* Security Footer */}
                <div className="mt-12 space-y-4">
                    <div className="flex items-center justify-center gap-6">
                        <div className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-widest border-r border-white/10 pr-6">
                            <span>🔒</span> AES-256
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-widest border-r border-white/10 pr-6">
                            <span>🛡️</span> SSL SECURE
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-widest">
                            <span>🛰️</span> NODO CATA-01
                        </div>
                    </div>
                    <p className="text-center text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] leading-relaxed italic">
                        Atención: El acceso no autorizado a sistemas críticos de salud provincial<br />es monitoreado y sancionado por la Ley de Ciberseguridad 25.326.
                    </p>
                </div>
            </div>
        </div>
    );
}
