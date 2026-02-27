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
        <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 font-sans">
            <div className="w-full max-w-md space-y-8">
                {/* Institutional Header */}
                <div className="text-center space-y-6">
                    <div className="flex justify-center">
                        <img
                            src="/brand/logo-ministerio.png"
                            alt="Ministerio de Salud"
                            className="h-16 md:h-20 object-contain"
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-brand-navy tracking-tight">Acceso Institucional</h1>
                        <p className="text-brand-muted text-sm font-medium mt-1">Plataforma Unificada de Información en Salud</p>
                    </div>
                </div>

                {/* Login Form */}
                <div className="admin-card p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-xs font-semibold rounded-xl animate-fade-in">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block ml-1">Correo Institucional</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="usuario@salud.gob.ar"
                                className="input-sober"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block ml-1">Contraseña</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="input-sober"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full btn-primary py-3.5 text-sm uppercase tracking-widest ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Verificando...' : 'Iniciar Sesión'}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="pt-4">
                    <p className="text-center text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-relaxed">
                        SISTEMA DE USO EXCLUSIVO PARA PERSONAL AUTORIZADO DEL<br />
                        MINISTERIO DE SALUD — CATAMARCA
                    </p>
                </div>
            </div>
        </div>
    );
}
