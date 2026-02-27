"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Profile, Persona } from "@/types";
import {
  FileText,
  Calendar,
  Inbox,
  Bot,
  Activity,
  Building2,
  Layers,
  Search,
  ShieldCheck,
  User,
  ArrowRight,
  Loader2,
  Database,
  Globe,
  CheckCircle2,
  AlertCircle,
  Clock
} from "lucide-react";

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
      description: "Historias clínicas y documentos del paciente.",
      icon: <FileText className="w-6 h-6" />,
      href: "/ficha-unificada",
      roles: ['admin', 'profesional', 'administrativo']
    },
    {
      name: "Turnos y Agendas",
      description: "Gestión de citas y disponibilidad clínica.",
      icon: <Calendar className="w-6 h-6" />,
      href: "/turnos",
      roles: ['admin', 'profesional', 'administrativo']
    },
    {
      name: "Bandeja Central",
      description: "Reclamos y expedientes pendientes.",
      icon: <Inbox className="w-6 h-6" />,
      href: "/pendientes",
      roles: ['admin', 'profesional', 'administrativo']
    },
    {
      name: "Asistente IA",
      description: "Soporte para toma de decisiones médicas.",
      icon: <Bot className="w-6 h-6" />,
      href: "/asistente-ia",
      roles: ['admin', 'profesional']
    },
    {
      name: "Semáforo Gestión",
      description: "Monitoreo de nodos de salud en tiempo real.",
      icon: <Activity className="w-6 h-6" />,
      href: "/semaforo",
      roles: ['admin']
    },
    {
      name: "Transparencia",
      description: "Portal de indicadores y evidencia pública.",
      icon: <Building2 className="w-6 h-6" />,
      href: "/transparencia",
      roles: ['admin']
    },
    {
      name: "Unificación",
      description: "Gestión de secretarías y SIGESA.",
      icon: <Layers className="w-6 h-6" />,
      href: "/unificacion",
      roles: ['admin']
    },
    {
      name: "Búsqueda PRO",
      description: "Localización avanzada de registros.",
      icon: <Search className="w-6 h-6" />,
      href: "/busqueda",
      roles: ['admin', 'profesional', 'administrativo']
    },
    {
      name: "Registro Evidencia",
      description: "Auditoría sistemática de gestión.",
      icon: <ShieldCheck className="w-6 h-6" />,
      href: "/auditoria/evidencia",
      roles: ['admin']
    }
  ];

  const filteredModulos = modulos.filter(m =>
    !profile || m.roles.includes(profile.rol)
  );

  const statusModulos = [
    { name: "Ficha Unificada", status: "REAL", detail: "Conectado a Nodo Central", color: "text-emerald-500", icon: <Database className="w-4 h-4" /> },
    { name: "Repositorio Digital", status: "REAL", detail: "Storage Operativo 100%", color: "text-emerald-500", icon: <CheckCircle2 className="w-4 h-4" /> },
    { name: "Gestión de Turnos", status: "REAL", detail: "Agendas Sincronizadas", color: "text-emerald-500", icon: <Clock className="w-4 h-4" /> },
    { name: "Bandeja Central", status: "REAL", detail: "Distribución Activa", color: "text-emerald-500", icon: <Inbox className="w-4 h-4" /> },
    { name: "Semáforo Gestión", status: "PARCIAL", detail: "Indicadores en despliegue", color: "text-amber-500", icon: <Activity className="w-4 h-4" /> },
    { name: "Asistente IA", status: "PROTOTIPO", detail: "Motor de inferencia en v4.2", color: "text-slate-400", icon: <Bot className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-12 animate-fade-in max-w-6xl mx-auto py-8 font-outfit">
      {/* Institutional Hero */}
      <section className="bg-brand-navy rounded-[40px] p-12 text-white shadow-2xl shadow-brand-navy/20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-[0.3em] text-white/90">
              Gobierno de Catamarca
            </span>
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">
              Portal Unificado de Salud
            </h1>
            <p className="text-white/60 text-xl font-bold max-w-2xl leading-relaxed italic">
              Gestión clínica digital integrada para el sistema provincial de salud.
            </p>
          </div>
        </div>
      </section>

      {/* Main Search Section */}
      <section className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-xl shadow-slate-100 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-navy text-white flex items-center justify-center shadow-lg shadow-brand-navy/20">
              <Search className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-brand-navy uppercase tracking-tight">Localizador de Pacientes</h2>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Acceso a historial clínico mediante DNI o ID</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 italic text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Globe className="w-3 h-3 text-brand-navy/30" />
            Nodo Sincronizado
          </div>
        </div>

        <div className="relative group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ingrese DNI o Apellido para búsqueda rápida..."
            className="w-full px-8 py-5 rounded-[24px] bg-slate-50 border-2 border-slate-100 focus:border-brand-navy/20 focus:ring-8 focus:ring-brand-navy/5 outline-none text-xl font-black transition-all text-brand-navy placeholder:text-slate-300"
          />
          {isSearching && (
            <div className="absolute right-8 top-1/2 -translate-y-1/2">
              <Loader2 className="w-6 h-6 text-brand-navy animate-spin" />
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
            {searchResults.map((p) => (
              <div key={p.id} className="p-6 rounded-[28px] border border-slate-100 bg-white flex items-center justify-between gap-4 hover:border-brand-navy/30 hover:bg-slate-50 transition-all group shadow-sm">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-navy group-hover:text-white transition-all shadow-inner">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-brand-navy uppercase tracking-tight">{p.nombre} {p.apellido}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                      DNI {p.dni} • {p.fecha_nacimiento ? `${new Date().getFullYear() - new Date(p.fecha_nacimiento).getFullYear()} años` : "N/A"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/ficha-unificada?personaId=${p.id}`)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-brand-navy hover:bg-brand-navy hover:text-white transition-all group-hover:scale-110"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Operational Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModulos.map((modulo) => (
          <a key={modulo.name} href={modulo.href} className="bg-white p-8 rounded-[36px] border border-slate-200 hover:border-brand-navy/30 hover:shadow-2xl hover:shadow-brand-navy/5 transition-all group flex flex-col gap-6">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 text-brand-navy flex items-center justify-center group-hover:bg-brand-navy group-hover:text-white transition-all shadow-inner">
              {modulo.icon}
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-brand-navy uppercase tracking-tighter group-hover:translate-x-1 transition-transform">{modulo.name}</h3>
              <p className="text-slate-400 text-xs font-bold leading-relaxed">{modulo.description}</p>
            </div>
          </a>
        ))}
      </div>

      {/* System Status Dashboard */}
      {profile?.rol === 'admin' && (
        <section className="bg-brand-navy rounded-[48px] p-12 text-white space-y-10 shadow-2xl shadow-brand-navy/30">
          <div className="flex items-center justify-between border-b border-white/10 pb-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-brand-accent" />
                Estado de Infraestructura
              </h2>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Protocolo de Conectividad y Salud del Nodo</p>
            </div>
            <div className="flex gap-4">
              <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-widest italic">
                Uptime: 99.9%
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statusModulos.map((m) => (
              <div key={m.name} className="p-6 rounded-[32px] bg-white/5 border border-white/5 hover:bg-white/10 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-12 bg-white/5 rounded-full -mr-6 -mt-6 group-hover:scale-150 transition-transform" />
                <div className="flex flex-col justify-between h-full gap-8 relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="p-3 bg-white/5 rounded-xl text-white/80">
                      {m.icon}
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-white/5 ${m.color}`}>
                      {m.status}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-black uppercase tracking-widest text-white">{m.name}</p>
                    <p className="text-[9px] text-white/40 font-bold uppercase tracking-tight">{m.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
