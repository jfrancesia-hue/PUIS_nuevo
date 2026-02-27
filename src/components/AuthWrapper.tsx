"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import AuthenticatedShell from "./AuthenticatedShell";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (pathname === "/login" || pathname === "/acceso-gob") {
            setIsAuthenticated(true);
            return;
        }

        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/me');
                const data = await res.json();

                if (data.ok && data.user) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    router.push("/login");
                }
            } catch (err) {
                setIsAuthenticated(false);
                router.push("/login");
            }
        };

        checkAuth();
    }, [pathname, router]);

    // While checking auth, show a high-fidelity loading state
    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen bg-[#002b49] flex flex-col items-center justify-center p-10 font-outfit">
                <div className="flex flex-col items-center gap-6 animate-pulse">
                    <div className="w-16 h-16 rounded-full border-4 border-[#f9b000]/30 border-t-[#f9b000] animate-spin" />
                    <div className="text-center">
                        <p className="text-white text-sm font-black uppercase tracking-[0.3em]">Cargando Nodo de Seguridad</p>
                        <p className="text-sky-200/40 text-[10px] uppercase tracking-[0.2em] mt-2 italic">Verificando encriptación ministerial...</p>
                    </div>
                </div>
            </div>
        );
    }

    // If on login page, render children only (no shell)
    if (pathname === "/login") {
        return <>{children}</>;
    }

    // If authenticated, render within the shell
    if (isAuthenticated) {
        return <AuthenticatedShell>{children}</AuthenticatedShell>;
    }

    return null;
}
