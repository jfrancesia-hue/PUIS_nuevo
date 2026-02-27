import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OnboardingRecorrido from "@/components/OnboardingRecorrido";
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
  Loader2
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
    { name: "Ficha Unificada", status: "REAL", detail: "Conectado a Nodo Central", color: "text-emerald-600" },
    { name: "Documentación", status: "REAL", detail: "Repositorio Digital Operativo", color: "text-emerald-600" },
    { name: "Turnos", status: "REAL", detail: "Agenda Sincronizada", color: "text-emerald-600" },
    { name: "Bandeja", status: "REAL", detail: "Gestión de Expedientes", color: "text-emerald-600" },
    { name: "Semáforo Gestión", status: "PARCIAL", detail: "Indicadores en despliegue", color: "text-amber-600" },
    { name: "Asistente IA", status: "PROTOTIPO", detail: "En fase de entrenamiento", color: "text-slate-400" },
  ];

  return (
    <div className="space-y-10 animate-fade-in max-w-6xl mx-auto py-6">
      {/* Institutional Hero */}
      <section className="bg-brand-navy rounded-3xl p-10 text-white shadow-sm overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-widest text-white/80">
              Gestión Gubernamental
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Plataforma Unificada de Información en Salud
          </h1>
          <p className="text-white/70 text-lg font-medium max-w-2xl leading-relaxed">
            Catamarca Salud. Acceso integrado a la gestión clínica, administrativa y estratégica del sistema provincial.
          </p>
        </div>
      </section>

      {/* Onboarding */}
      <OnboardingRecorrido />

      {/* Main Search */}
      <section className="admin-card p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-navy/5 flex items-center justify-center text-brand-navy">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Búsqueda Unificada de Pacientes</h2>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Acceso directo a Ficha Clínica</p>
          </div>
        </div>

        <div className="relative group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ingrese DNI, Apellido o ID de Ficha..."
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-brand-navy focus:ring-4 focus:ring-brand-navy/5 outline-none text-lg font-semibold transition-all text-slate-900 placeholder:text-slate-400"
          />
          {isSearching && (
            <div className="absolute right-6 top-1/2 -translate-y-1/2">
              <Loader2 className="w-5 h-5 text-brand-navy animate-spin" />
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
            {searchResults.map((p) => (
              <div key={p.id} className="p-4 rounded-xl border border-slate-100 bg-white flex items-center justify-between gap-4 hover:border-brand-navy transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-navy/5 group-hover:text-brand-navy transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{p.nombre} {p.apellido}</h3>
                    <p className="text-xs font-semibold text-slate-500">
                      DNI {p.dni} • {p.fecha_nacimiento ? `${new Date().getFullYear() - new Date(p.fecha_nacimiento).getFullYear()} años` : "N/A"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/ficha-unificada?personaId=${p.id}`)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-navy text-white text-[11px] font-bold uppercase tracking-wider hover:bg-brand-navy-2 transition-all shadow-sm"
                >
                  Abrir Ficha
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {searchQuery.length >= 3 && searchResults.length === 0 && !isSearching && (
          <div className="py-6 text-center">
            <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Sin resultados para "{searchQuery}"</p>
          </div>
        )}
      </section>

      {/* Service Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModulos.map((modulo) => (
          <a key={modulo.name} href={modulo.href} className="admin-card p-6 flex items-start gap-4 hover:border-brand-navy hover:bg-slate-50/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-slate-50 text-brand-navy flex items-center justify-center group-hover:bg-brand-navy group-hover:text-white transition-all shadow-sm">
              {modulo.icon}
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-navy transition-colors">{modulo.name}</h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">{modulo.description}</p>
            </div>
          </a>
        ))}
      </div>

      {/* Admin Board */}
      {profile?.rol === 'admin' && (
        <section className="admin-card bg-slate-900 border-none p-10 text-white space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight">Estado de Operaciones</h2>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Mapa de Capacidades del Sistema</p>
            </div>
            <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] font-bold uppercase tracking-wider">
              Protocolo Industrial
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statusModulos.map((m) => (
              <div key={m.name} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between h-24">
                <p className="text-[11px] font-bold uppercase tracking-wider text-white/80">{m.name}</p>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-white/40 font-medium">{m.detail}</p>
                  <p className={`text-[9px] font-bold uppercase tracking-widest ${m.color}`}>{m.status}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
