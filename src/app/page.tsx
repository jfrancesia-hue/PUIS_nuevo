"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OnboardingRecorrido from "@/components/OnboardingRecorrido";
import { Profile, Persona } from "@/types";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Persona[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile/me');
      const data = await res.json();
      if (data.ok) {
        setProfile(data.item);
      }
    } catch (err) {
      console.error("Home profile error:", err);
    }
  };

  useEffect(() => {
    if (searchQuery.length < 3) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/personas/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (data.ok) {
          setSearchResults(data.items || []);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const modulos = [
    {
      name: "Ficha Unificada",
      description: "Repositorio central de historias clínicas y documentos.",
      icon: "📋",
      href: "/ficha-unificada",
      color: "bg-[#0067b1]",
      roles: ['admin', 'profesional', 'administrativo']
    },
    {
      name: "Turnos y Agendas",
      description: "Gestión de citas y disponibilidad médica.",
      icon: "📅",
      href: "/turnos",
      color: "bg-[#002b49]",
      roles: ['admin', 'profesional', 'administrativo']
    },
    {
      name: "Bandeja Central",
      description: "Gestión de reclamos y expedientes pendientes.",
      icon: "📥",
      href: "/pendientes",
      color: "bg-zinc-800",
      roles: ['admin', 'profesional', 'administrativo']
    },
    {
      name: "Asistente IA",
      description: "Soporte cognitivo para toma de decisiones.",
      icon: "🤖",
      href: "/asistente-ia",
      color: "bg-emerald-600",
      roles: ['admin', 'profesional']
    },
    {
      name: "Semáforo Gestión",
      description: "Monitoreo de nodos de salud en tiempo real.",
      icon: "🚥",
      href: "/semaforo",
      color: "bg-red-600",
      roles: ['admin']
    },
    {
      name: "Transparencia",
      description: "Portal de indicadores y evidencia pública.",
      icon: "🏛️",
      href: "/transparencia",
      color: "bg-amber-500",
      roles: ['admin']
    },
    {
      name: "Unificación",
      description: "Gestión centralizada de secretarías y SIGESA.",
      icon: "🏢",
      href: "/unificacion",
      color: "bg-blue-600",
      roles: ['admin']
    },
    {
      name: "Búsqueda PRO",
      description: "Localización avanzada de registros y expedientes.",
      icon: "🔎",
      href: "/busqueda",
      color: "bg-sky-500",
      roles: ['admin', 'profesional', 'administrativo']
    },
    {
      name: "Registro Evidencia",
      description: "Auditoría sistemática y blindaje de gestión.",
      icon: "🛡️",
      href: "/auditoria/evidencia",
      color: "bg-zinc-700",
      roles: ['admin']
    }
  ];

  const filteredModulos = modulos.filter(m =>
    !profile || m.roles.includes(profile.rol)
  );

  const statusModulos = [
    { name: "Ficha Unificada", status: "REAL", detail: "Conectado a Supabase API", color: "text-emerald-500" },
    { name: "Documentación", status: "REAL", detail: "Storage S3 Operativo", color: "text-emerald-500" },
    { name: "Recorrido Onboarding", status: "REAL", detail: "Tracking persistente activo", color: "text-emerald-500" },
    { name: "Semáforo Gestión", status: "PARCIAL", detail: "Frontend completo, data estática", color: "text-amber-500" },
    { name: "Portal Transparencia", status: "PARCIAL", detail: "UI funcional, requiere integración", color: "text-amber-500" },
    { name: "Búsqueda Inteligente", status: "REAL", detail: "API pacientes integrada", color: "text-emerald-500" },
    { name: "Asistente IA", status: "EN CONSTRUCCIÓN", detail: "Base de conocimientos pendiente", color: "text-zinc-400" },
    { name: "Diagnóstico Sistema", status: "REAL", detail: "Panel de salud pro-activo", color: "text-emerald-500" },
  ];

  return (
    <div className="space-y-12 animate-fade-in max-w-6xl mx-auto py-8">
      {/* Welcome Section */}
      <section className="bg-[#002b49] rounded-[48px] p-12 text-white relative overflow-hidden shadow-2xl border-b-8 border-[#f9b000]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0067b1]/20 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4">
            <div className="px-4 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-black uppercase tracking-[0.3em] inline-block">
              Sistema Operativo de Salud
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase font-outfit">
              Bienvenido al <span className="text-sky-400">PUIS</span>
            </h1>
            <p className="text-zinc-400 text-lg font-bold max-w-xl leading-relaxed">
              Plataforma Unificada de Información en Salud de la Provincia de Catamarca. Inicie la gestión seleccionando un módulo.
            </p>
          </div>
          <div className="flex -space-x-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-16 h-16 rounded-2xl bg-zinc-800 border-4 border-[#002b49] flex items-center justify-center text-xl grayscale opacity-50">
                🛡️
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recorrido de Primer Uso */}
      <OnboardingRecorrido />

      {/* Buscador de Personas - Card Superior */}
      <section className="bg-white rounded-[48px] p-10 border border-zinc-100 shadow-2xl space-y-8 mx-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tighter uppercase font-outfit">Búsqueda de Personas</h2>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Acceso rápido a Ficha Unificada</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-sky-500/10 flex items-center justify-center text-3xl">
            🔎
          </div>
        </div>

        <div className="relative group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ingrese DNI o Apellido..."
            className="w-full px-10 py-6 rounded-[32px] bg-zinc-50 border-2 border-zinc-100 focus:border-[#0067b1] outline-none text-xl font-bold transition-all shadow-inner"
          />
          {isSearching && (
            <div className="absolute right-6 top-1/2 -translate-y-1/2">
              <div className="w-6 h-6 border-4 border-[#0067b1]/30 border-t-[#0067b1] rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Ejemplos de búsqueda */}
        <div className="flex flex-wrap gap-2 px-4">
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mr-2">Ejemplos:</span>
          {['20123456', '30111222', '27123456', '35999888'].map(dni => (
            <button
              key={dni}
              onClick={() => setSearchQuery(dni)}
              className="px-3 py-1 rounded-full bg-zinc-100 hover:bg-[#0067b1] hover:text-white transition-all text-[9px] font-bold text-zinc-500 uppercase tracking-tight"
            >
              {dni}
            </button>
          ))}
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            {searchResults.map((p) => (
              <div key={p.id} className="p-6 rounded-[32px] bg-white border border-zinc-100 flex items-center justify-between gap-6 hover:border-[#0067b1] hover:shadow-xl transition-all group">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    👤
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-zinc-900 uppercase font-outfit">{p.nombre} {p.apellido}</h3>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                      DNI: <span className="text-zinc-900">{p.dni}</span> • {p.fecha_nacimiento ? `${new Date().getFullYear() - new Date(p.fecha_nacimiento).getFullYear()} años` : "N/A"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/ficha-unificada?personaId=${p.id}`)}
                  className="px-8 py-4 rounded-2xl bg-[#0067b1] text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#0067b1]/20 hover:bg-[#005694] active:scale-95 transition-all"
                >
                  Abrir Ficha ➔
                </button>
              </div>
            ))}
          </div>
        )}

        {searchQuery.length >= 3 && searchResults.length === 0 && !isSearching && (
          <div className="py-10 text-center opacity-50">
            <p className="text-zinc-500 font-black uppercase tracking-[0.2em] text-xs">No se encontraron resultados para "{searchQuery}"</p>
          </div>
        )}
      </section>

      {/* Grid of Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        {filteredModulos.map((modulo) => (
          <a key={modulo.name} href={modulo.href} className="group relative bg-white p-10 rounded-[40px] border border-zinc-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden flex items-center gap-8">
            <div className={`absolute top-0 right-0 w-2 h-full ${modulo.color} group-hover:w-4 transition-all`} />
            <div className={`w-20 h-20 rounded-[28px] ${modulo.color} text-white flex items-center justify-center text-4xl shadow-lg shadow-zinc-200 group-hover:rotate-6 transition-transform`}>
              {modulo.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-black text-zinc-900 tracking-tighter uppercase">{modulo.name}</h3>
              <p className="text-zinc-500 text-xs font-bold mt-1 uppercase tracking-widest opacity-60 leading-relaxed">{modulo.description}</p>
            </div>
          </a>
        ))}
      </div>

      {/* Module Status Board (Visible only for Admin) */}
      {profile?.rol === 'admin' && (
        <section className="bg-zinc-900 rounded-[48px] p-12 text-white shadow-2xl space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-black tracking-tighter uppercase">Estado de Módulos</h2>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Mapa Realista de Capacidades del Sistema</p>
            </div>
            <div className="px-5 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-black uppercase tracking-widest">
              Protocolo Industrial PUIS
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {statusModulos.map((m) => (
              <div key={m.name} className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-tight">{m.name}</p>
                  <p className="text-[10px] text-zinc-500 font-bold">{m.detail}</p>
                </div>
                <div className="text-right">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${m.color}`}>{m.status}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}

