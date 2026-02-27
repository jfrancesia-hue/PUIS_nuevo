"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

            // Redirect to home/ficha
            router.push("/ficha-unificada");
        } catch (err) {
            setError("Error de conexión con el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6 font-sans">
            <div className="w-full max-w-md space-y-8">
                {/* Institutional Header */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#0067b1] flex items-center justify-center font-black text-white text-xl">C</div>
                        <div className="text-left font-outfit">
                            <p className="text-zinc-500 font-black text-sm leading-none">Catamarca</p>
                            <p className="text-[#0067b1] font-black text-2xl leading-none uppercase tracking-tighter">Gobierno</p>
                        </div>
                    </div>
                    <div className="pt-8">
                        <h1 className="text-3xl font-black text-zinc-900 tracking-tight uppercase">Acceso PUIS</h1>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">Plataforma Unificada de Información en Salud</p>
                    </div>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-[40px] shadow-2xl p-10 border border-zinc-100">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-[11px] font-black uppercase tracking-widest rounded-2xl">
                                ⚠️ {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-4">Correo Institucional</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ej: admin@demo.com"
                                className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-[#0067b1] focus:ring-4 focus:ring-[#0067b1]/5 outline-none transition-all font-bold text-zinc-900"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-4">Contraseña</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-[#0067b1] focus:ring-4 focus:ring-[#0067b1]/5 outline-none transition-all font-bold text-zinc-900"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-5 bg-[#0067b1] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all ${loading ? 'opacity-50' : 'hover:bg-[#005694] active:scale-95'}`}
                        >
                            {loading ? 'Verificando...' : 'Iniciar Sesión ➔'}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed mt-10">
                    SISTEMA DE USO EXCLUSIVO PARA PERSONAL AUTORIZADO DEL<br />
                    MINISTERIO DE SALUD DE LA PROVINCIA DE CATAMARCA
                </p>

                <div className="flex justify-center mt-6">
                    <a href="/acceso-gob" className="text-[9px] font-black text-zinc-300 uppercase tracking-widest hover:text-[#0067b1] transition-colors">
                        Acceso Biométrico (Legacy)
                    </a>
                </div>
            </div>
        </div>
    );
}
