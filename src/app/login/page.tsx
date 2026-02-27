"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2 } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!data.ok) {
                setError(data.error || "Credenciales inválidas");
                return;
            }

            router.push("/ficha-unificada");
        } catch (err) {
            setError("Error de conexión con el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 font-outfit">
            <div className="w-full max-w-lg space-y-8 animate-fade-in">

                {/* 
                  CRITICAL: Using dark blue container (#0B2D4D) 
                  as requested to contrast with white logo 
                */}
                <div className="bg-[#0B2D4D] rounded-[40px] p-12 shadow-2xl shadow-brand-navy/40 border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24 blur-2xl" />

                    <form onSubmit={handleLogin} className="space-y-8 relative z-10">
                        <div className="flex flex-col items-center gap-8 mb-12">
                            <img
                                src="/brand/logo-ministerio.png"
                                alt="Ministerio de Salud"
                                className="h-24 w-auto object-contain brightness-0 invert"
                            />
                            <div className="text-center space-y-2">
                                <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Acceso Institucional v6.0</h1>
                                <p className="text-white/40 text-xs font-bold uppercase tracking-[0.3em] font-sans">Gestión Unificada de Salud</p>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-500/20 border border-red-500/30 text-red-100 text-xs font-black rounded-2xl text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/50 uppercase tracking-widest block ml-2">Correo Oficial</label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="usuario@salud.gob.ar"
                                    className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border-2 border-white/10 text-white placeholder:text-white/10 focus:bg-white/10 focus:border-brand-accent outline-none transition-all font-bold text-lg"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/50 uppercase tracking-widest block ml-2">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border-2 border-white/10 text-white placeholder:text-white/10 focus:bg-white/10 focus:border-brand-accent outline-none transition-all font-bold text-lg"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-[#F5B400] text-[#0B2D4D] rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.03] active:scale-95 transition-all shadow-xl shadow-[#F5B400]/20 flex items-center justify-center gap-4 mt-6"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Validar y Entrar"}
                        </button>
                    </form>
                </div>

                <div className="text-center opacity-40">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
                        Ministerio de Salud | Catamarca Gobierno<br />
                        Acceso restringido a personal de salud pública
                    </p>
                </div>
            </div>
        </div>
    );
}
